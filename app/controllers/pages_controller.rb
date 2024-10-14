class PagesController < ApplicationController
  include Phlex::Rails::Streaming

  def index
    stream Views::Pages::Index.new
  end
end
