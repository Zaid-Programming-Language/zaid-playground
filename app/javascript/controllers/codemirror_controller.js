import { Controller } from "@hotwired/stimulus"

import { basicSetup, EditorView } from "codemirror"
import { keymap } from "@codemirror/view"

// Connects to data-controller="codemirror"
export default class extends Controller {
  static targets = ["editor", "input"]
  static values = {
    doc: String
  }

  connect() {
    this.editor = new EditorView({
      doc: this.docValue,
      extensions: [
        basicSetup,
        keymap.of([
          {
            key: "Shift-ـ",
            run: (view) => {
              view.dispatch(view.state.replaceSelection("_"))
              return true
            }
          }
        ])
      ],
      parent: this.editorTarget
    })
  }

  disconnect() {
    this.editor.destroy()
  }
}
