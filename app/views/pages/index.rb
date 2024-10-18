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
        splash_screen
        editor
        results
      end
    end
  end

  private

  def splash_screen
    div(class: "absolute top-0 left-0 w-full h-full bg-white z-50", data: { codemirror_target: "loading" }) do
      div(class: "flex flex-col items-center justify-center h-full") do
        img(class: "size-44 mb-4", src: "/icon.svg")

        RBUI::TypographyLarge() { t("zaid_playground") }

        div(class: "flex items-center") do
          RBUI::TypographyMuted(class: "me-2") { t(".preparing") }

          div(class: "size-3 bg-[#982B1C] animate-bounce me-1")
          div(class: "size-3 bg-[#982B1C] animate-bounce")
        end
      end
    end
  end

  def editor
    div(class: "flex flex-col h-[50vh] w-full sm:h-screen sm:w-1/2 p-4 max-sm:pb-2 sm:pe-2") do
      div(class: "flex justify-between items-center mb-4") do
        div(class: "flex items-center gap-1") do
          img(class: "size-12", src: "/icon.svg")

          div do
            RBUI::TypographyLarge() { t("zaid_playground") }
            RBUI::TypographyMuted() { t(".start_writing_your_code_in_arabic") }
          end
        end

        RBUI::DropdownMenu(options: { placement: "bottom-end" }, class: "z-40") do
          RBUI::DropdownMenuTrigger(class: "w-full") do
            RBUI::Button(size: :xl, variant: :outline, class: "flex gap-2") do
              Hero::CodeBracket(variant: :solid, class: "size-5")

              plain t(".examples")
            end
          end

          RBUI::DropdownMenuContent(class: "max-h-56 overflow-y-auto") do
            RBUI::DropdownMenuLabel() { t(".syntax") }
            RBUI::DropdownMenuSeparator()
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "comments" }) { t(".comments") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "variables" }) { t(".variables") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "printing" }) { t(".printing") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "comparison_operations" }) { t(".comparison_operations") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "logical_operations" }) { t(".logical_operations") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "mathematical_operations" }) { t(".mathematical_operations") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "if_statements" }) { t(".if_statements") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "loop_statements" }) { t(".loop_statements") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "methods" }) { t(".methods") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "classes" }) { t(".classes") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "arrays" }) { t(".arrays") }
            RBUI::DropdownMenuLabel() { t(".advanced_examples") }
            RBUI::DropdownMenuSeparator()
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "odd_and_even" }) { t(".odd_and_even") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "mean" }) { t(".mean") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "check_for_leap_year" }) { t(".check_for_leap_year") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "factorial" }) { t(".factorial") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "is_prime_number" }) { t(".is_prime_number") }
            RBUI::DropdownMenuItem(data_action: "codemirror#showExample", data: { example: "prime_numbers" }) { t(".prime_numbers") }
          end
        end
      end

      div(
        class: "h-full border border-solid rounded overflow-scroll [&_*]:font-cascadia-mono [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-scroll [&_.cm-editor.cm-focused]:outline-none",
        data: { codemirror_target: "editor" }
      )

      input(type: "hidden", data: { codemirror_target: "input", run_zaid_target: "input" })
    end
  end

  def results
    div(class: "flex flex-col h-[50vh] w-full sm:h-screen sm:w-1/2 p-4 max-sm:pt-2 sm:ps-2") do
      div(class: "hidden sm:flex justify-between gap-4 mb-4") do
        div(class: "flex") do
          RBUI::Button(size: :xl, class: "hidden sm:flex gap-2 pe-5", data: { action: "click->run-zaid#run", run_zaid_target: "disable" }) do
            plain t(".run")

            Hero::Play(variant: :outline, class: "size-5 scale-x-[-1]")
          end
        end

        div(class: "flex gap-4") do
          save_modal do
            RBUI::Button(variant: :outline, size: :xl, class: "hidden sm:flex gap-2 pe-5", data: { run_zaid_target: "disable" }) do
              plain t(".save")

              Bootstrap::Floppy(class: "size-4")
            end
          end

          open_modal do
            RBUI::Button(variant: :outline, size: :xl, class: "hidden sm:flex gap-2 pe-5", data: { run_zaid_target: "disable" }) do
              plain t(".open")

              Hero::FolderOpen(variant: :outline, class: "size-5")
            end
          end
        end
      end

      div(class: "flex sm:hidden justify-between gap-4 mb-4") do
        div(class: "flex") do
          RBUI::Button(class: "flex sm:hidden gap-2 pe-3", data: { action: "click->run-zaid#run", run_zaid_target: "run" }) do
            plain t(".run")

            Hero::Play(variant: :outline, class: "size-4 scale-x-[-1]")
          end
        end

        div(class: "flex gap-4") do
          save_modal do
            RBUI::Button(variant: :outline, class: "gap-2 pe-5", data: { run_zaid_target: "disable" }) do
              plain t(".save")

              Bootstrap::Floppy(class: "size-4")
            end
          end

          open_modal do
            RBUI::Button(variant: :outline, class: "gap-2 pe-5", data: { run_zaid_target: "disable" }) do
              plain t(".open")

              Hero::FolderOpen(variant: :outline, class: "size-5")
            end
          end
        end
      end

      div(class: "h-full p-1 font-cascadia-mono border border-solid rounded bg-[#fcfcfc] overflow-y-scroll", data: { run_zaid_target: "output" }) do
        t(".output_will_appear_here")
      end
    end
  end

  def save_modal(&block)
    RBUI::Dialog() do
      RBUI::DialogTrigger(&block)

      RBUI::DialogContent(class: "rtl:[&>button]:left-4 rtl:[&>button]:right-auto", data: { controller: "save-zaid" }) do
        RBUI::DialogHeader(class: "rtl:text-right") do
          RBUI::DialogTitle() { t(".save_your_code") }
          RBUI::DialogDescription() { t(".save_your_code_description") }
        end

        RBUI::DialogMiddle() do
          div(class: "grid w-full items-center gap-1.5") do
            label(for: "code-name") { t(".code_name") }
            RBUI::Input(type: "text", id: "code-name", data: { save_zaid_target: "name" })
          end
        end

        RBUI::DialogFooter(class: "rtl:space-x-reverse") do
          RBUI::Button(variant: :outline, data: { action: "click->rbui--dialog#dismiss" }) { t(".close") }
          RBUI::Button(data: { action: "save-zaid#save" }) { t(".save") }
        end
      end
    end
  end

  def open_modal(&block)
    RBUI::Dialog() do
      RBUI::DialogTrigger(&block)

      RBUI::DialogContent(class: "rtl:[&>button]:left-4 rtl:[&>button]:right-auto", data: { controller: "open-zaid" }) do
        RBUI::DialogHeader(class: "rtl:text-right") do
          RBUI::DialogTitle() { t(".open_your_code") }
          RBUI::DialogDescription() { t(".open_your_code_description") }
        end

        RBUI::DialogMiddle() do
          plain t(".saved_codes")

          RBUI::Card(class: "w-full p-2 mt-2 shadow-sm") do
            RBUI::CardContent(class: "space-y-2 p-0 max-h-56 overflow-y-auto", data: { open_zaid_target: "list" })
          end
        end

        RBUI::DialogFooter(class: "rtl:space-x-reverse") do
          RBUI::Button(variant: :outline, data: { action: "click->rbui--dialog#dismiss" }) { t(".close") }
        end
      end
    end
  end
end
