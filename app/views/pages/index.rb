# frozen_string_literal: true

class Views::Pages::Index < Views::Base
  def view_template
    Layout(title: t("zaid_playground")) do
      div(
        class: "flex flex-col sm:flex-row",
        data: {
          controller: "run-zaid codemirror",
          action: "keydown.ctrl+enter@document->run-zaid#run keydown.meta+enter@document->run-zaid#run",
          codemirror_doc_value: ""
        }
      ) do
        div(class: "absolute top-0 left-0 w-full h-full bg-white z-50", data: { codemirror_target: "loading" }) do
          div(class: "flex flex-col items-center justify-center h-full") do
            img(class: "size-[200px] mb-4", src: "/icon.svg")

            RBUI::TypographyLarge() do
              plain t("zaid_playground")
              whitespace
              plain "🤖"
            end

            div(class: "flex items-center gap-2") do
              RBUI::TypographyMuted() { t(".preparing") }

              div(class: "size-4 rounded-full bg-[#800000] animate-pulse")
            end
          end
        end

        div(class: "flex flex-col h-[50vh] w-full sm:h-screen sm:w-1/2 p-4 max-sm:pb-2 sm:pe-2") do
          div(class: "flex items-center gap-1 mb-4") do
            img(class: "size-12", src: "/icon.svg")

            div do
              RBUI::TypographyLarge() do
                plain t("zaid_playground")
                whitespace
                plain "🤖"
              end

              RBUI::TypographyMuted() { t(".start_writing_your_code_in_arabic") }
            end
          end

          div(
            class: "h-full border border-solid rounded overflow-scroll [&_*]:font-cascadia-mono [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-scroll [&_.cm-editor.cm-focused]:outline-none",
            data: { codemirror_target: "editor" }
          )

          input(type: "hidden", data: { codemirror_target: "input", run_zaid_target: "input" })
        end

        div(class: "flex flex-col h-[50vh] w-full sm:h-screen sm:w-1/2 p-4 max-sm:pt-2 sm:ps-2") do
          div(class: "flex items-center mb-4") do
            RBUI::Button(size: :xl, class: "hidden sm:flex gap-2 pe-5", data: { action: "click->run-zaid#run", run_zaid_target: "run" }) do
              plain t(".run")

              Hero::Play(variant: :outline, class: "size-4 scale-x-[-1]")
            end

            RBUI::Button(class: "flex sm:hidden gap-2 pe-3", data: { action: "click->run-zaid#run", run_zaid_target: "run" }) do
              plain t(".run")

              Hero::Play(variant: :outline, class: "size-4 scale-x-[-1]")
            end
          end

          div(class: "h-full p-1 font-cascadia-mono border border-solid rounded bg-[#fcfcfc] overflow-y-scroll", data: { run_zaid_target: "output" }) do
            t(".output_will_appear_here")
          end
        end
      end
    end
  end
end
