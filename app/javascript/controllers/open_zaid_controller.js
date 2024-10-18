import { Controller } from "@hotwired/stimulus"

import { EditorView } from "codemirror"

// Connects to data-controller="open-zaid"
export default class extends Controller {
  static targets = ["list"]

  connect() {
    const zaidCodes = JSON.parse(localStorage.getItem("zaid-codes")) || []

    if (zaidCodes.length > 0) {
      zaidCodes.forEach((zaidCode) => {
        this.listTarget.innerHTML += `
          <div class="flex gap-2">
            <div class="relative flex flex-1 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" data-action="click->open-zaid#open" data-code-name="${zaidCode.name}">${zaidCode.name}</div>

            <button type="button" class="whitespace-nowrap inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 w-9" data-action="click->open-zaid#delete" data-code-name="${zaidCode.name}">
              <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
              </svg>
            </button>
          </div>
        `
      })
    } else {
      this.listTarget.innerHTML = "<div class='text-center text-muted-foreground'>لا توجد شيفرات محفوظة</div>"
    }
  }

  open(event) {
    const codeName = event.target.getAttribute("data-code-name")
    const editor = EditorView.findFromDOM(document.querySelector(".cm-editor"))
    const zaidCodes = JSON.parse(localStorage.getItem("zaid-codes")) || []
    const zaidCode = zaidCodes.find((zaidCode) => zaidCode.name === codeName)

    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: zaidCode.code
      }
    })

    const dismissElement = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('[data-action="click->rbui--dialog#dismiss"]')

    if (dismissElement) {
      dismissElement.click()
    }
  }

  delete(event) {
    const codeName = event.target.getAttribute("data-code-name")
    const zaidCodes = JSON.parse(localStorage.getItem("zaid-codes")) || []
    const zaidCode = zaidCodes.find((zaidCode) => zaidCode.name === codeName)
    const index = zaidCodes.indexOf(zaidCode)

    zaidCodes.splice(index, 1)

    localStorage.setItem("zaid-codes", JSON.stringify(zaidCodes))

    event.target.closest("div").remove()
  }
}
