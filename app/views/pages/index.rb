# frozen_string_literal: true

class Views::Pages::Index < Views::Base
  def view_template
    Layout(title: t("zaid_playground")) do
      div(class: "flex flex-col sm:flex-row h-screen", data: { controller: "run-zaid" }) do
        div(class: "flex flex-1", data: { controller: "codemirror", codemirror_doc_value: "" }) do
          div(
            class: "[&_*]:font-cascadia-mono w-full [&_.cm-editor]:h-[50vh] sm:[&_.cm-editor]:h-screen",
            data: { codemirror_target: "editor" }
          )
          input(type: "hidden", data: { codemirror_target: "input", run_zaid_target: "input" })
        end

        div(class: "flex flex-1") do
          button(data: { action: "click->run-zaid#run" }) do
            "Run"
          end
        end
      end
    end
  end
end
