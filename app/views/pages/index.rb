# frozen_string_literal: true

class Views::Pages::Index < Views::Base
  def view_template
    Layout(title: t("zaid_playground")) do
      h1 { "Pages::Index" }
      p { "Find me in app/views/pages/index.rb" }
    end
  end
end
