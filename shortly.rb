require 'sinatra'
require "sinatra/reloader" if development?
require 'active_record'
require 'digest/sha1'
require 'pry'
require 'uri'
require 'open-uri'
require 'bcrypt'
require 'SecureRandom'
# require 'nokogiri'

###########################################################
# Configuration
###########################################################

set :public_folder, File.dirname(__FILE__) + '/public'

configure :development, :production do
    ActiveRecord::Base.establish_connection(
       :adapter => 'sqlite3',
       :database =>  'db/dev.sqlite3.db'
     )
end

# Handle potential connection pool timeout issues
after do
    ActiveRecord::Base.connection.close
end

# turn off root element rendering in JSON
ActiveRecord::Base.include_root_in_json = false

###########################################################
# Models
###########################################################
# Models to Access the database through ActiveRecord.
# Define associations here if need be
# http://guides.rubyonrails.org/association_basics.html

class Link < ActiveRecord::Base
    has_many :clicks

    validates :url, presence: true

    before_save do |record|
        record.code = Digest::SHA1.hexdigest(url)[0,5]
    end
end

class Click < ActiveRecord::Base
    belongs_to :link, counter_cache: :visits
end


class User < ActiveRecord::Base
  validates :email, :presence => true, :uniqueness => true
end

###########################################################
# Routes
###########################################################

get '/' do
  erb :index
end

# fetch() behavior
get '/links' do
    links = if params[:query]
      puts params[:query]
      Link.where("url like ?", "%#{params[:query]}%")
    elsif params[:sortBy]
      Link.order( params[:sortBy] + " DESC" );
    else
      Link.order("visits DESC")
    end
    links.map { |link|
      link.as_json.merge(base_url: request.base_url, updated_time: link.updated_at.strftime("%b %d, %Y %I:%M %p"))
    }.to_json
end

get '/signup' do
  if params[:errors]
    @error = params[:errors]
    erb :signup
  else
    erb :signup
  end
end

get '/login' do
  if params[:errors]
    @error = params[:errors]
    erb :login
  else
    erb :login
  end
end

post '/login' do
  user = User.find_by_email(params[:email])
  salt = user.password_salt
  check_hash = BCrypt::Engine.hash_secret(params[:password], salt)
  if (check_hash === user.password_hash)
    user.auth_token = SecureRandom.hex
    response.set_cookie(user.email, user.auth_token)
    redirect "/"
  else
    error = "The password and username do not match."
    redirect "/login?errors=#{error}"
  end
end

post '/users' do
  password_salt = BCrypt::Engine.generate_salt
  password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
  @user = User.new({email: params[:email], password_salt: password_salt, password_hash: password_hash, auth_token: SecureRandom.hex})
  if @user.save
    redirect "/"
  else
    redirect "/signup?errors=#{@user.errors.full_messages.last}"
  end
end

# link.save() behavior
post '/links' do
    data = JSON.parse request.body.read
    uri = URI(data['url'])
    raise Sinatra::NotFound unless uri.absolute?
    link = Link.find_by_url(uri.to_s) ||
           Link.create( url: uri.to_s, title: get_url_title(uri) )
    link.as_json.merge(base_url: request.base_url, updated_time: link.updated_at.strftime("%b %d, %Y %I:%M %p")).to_json
end

get '/:url' do
    link = Link.find_by_code params[:url]
    raise Sinatra::NotFound if link.nil?
    link.clicks.create!
    redirect link.url
end

###########################################################
# Utility
###########################################################

def read_url_head url
    head = ""
    url.open do |u|
        begin
            line = u.gets
            next  if line.nil?
            head += line
            break if line =~ /<\/head>/
        end until u.eof?
    end
    head + "</html>"
end

def get_url_title url
    # Nokogiri::HTML.parse( read_url_head url ).title
    result = read_url_head(url).match(/<title>(.*)<\/title>/)
    result.nil? ? "" : result[1]
end
