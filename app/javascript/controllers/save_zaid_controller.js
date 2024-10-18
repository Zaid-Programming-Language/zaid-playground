import { Controller } from "@hotwired/stimulus"

import { EditorView } from "codemirror"

// Connects to data-controller="save-zaid"
export default class extends Controller {
  static targets = ["name"]

  save(event) {
    if (!this.nameTarget.value) {
      return
    }

    const editor = EditorView.findFromDOM(document.querySelector(".cm-editor"))
    const zaidCodes = JSON.parse(localStorage.getItem("zaid-codes")) || []

    zaidCodes.push({ name: this.nameTarget.value, code: editor.state.doc.toString() })

    localStorage.setItem("zaid-codes", JSON.stringify(zaidCodes))

    const dismissElement = event.target.parentNode.querySelector('[data-action="click->rbui--dialog#dismiss"]')

    if (dismissElement) {
      dismissElement.click()
    }
  }
}
