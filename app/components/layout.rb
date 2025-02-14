# frozen_string_literal: true

class Components::Layout < Components::Base
  def initialize(title:)
    @title = title
  end

  def view_template
    doctype

    html(dir: "rtl", class: "light") do
      head do
        title { @title }

        meta(name: "viewport", content: "width=device-width,initial-scale=1")
        meta(name: "mobile-web-app-capable", content: "yes")
        meta(name: "view-transition", content: "same-origin")
        csrf_meta_tags
        csp_meta_tag

        link(rel: "manifest", href: pwa_manifest_path(format: :json))

        link(rel: "icon", href: "/icon.png", type: "image/png")
        link(rel: "icon", href: "/icon.svg", type: "image/svg+xml")
        link(rel: "apple-touch-icon", href: "/icon.png")

        stylesheet_link_tag :app, "data-turbo-track": "reload"
        javascript_include_tag "application", "data-turbo-track": "reload", type: "module"
        stylesheet_link_tag "application", "data-turbo-track": "reload"
      end

      body { yield }
    end
  end
end
