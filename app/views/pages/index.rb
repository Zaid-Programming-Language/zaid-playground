# frozen_string_literal: true

class Views::Pages::Index < Views::Base
  def view_template
    Layout(title: t("zaid_playground")) do
      div(data: { controller: "codemirror", codemirror_doc_value: "" }) do
        div(class: "[&_*]:font-cascadia-mono [&_.cm-editor]:h-[50vh]", data: { codemirror_target: "editor" })
      end

      div(class: "h-[50vh]") do
      end
    end
  end
end
