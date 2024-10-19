import { Controller } from "@hotwired/stimulus"

import { basicSetup, EditorView } from "codemirror"
import { keymap } from "@codemirror/view"
import { StreamLanguage } from "@codemirror/language"
import { indentWithTab } from "@codemirror/commands"
import { ayuLight } from "thememirror"

import { zaid } from "../zaid"

// Connects to data-controller="codemirror"
export default class extends Controller {
  static targets = ["editor", "input", "loading"]
  static values = {
    doc: String
  }

  connect() {
    this.editor = new EditorView({
      doc: this.docValue,
      extensions: [
        basicSetup,
        StreamLanguage.define(zaid),
        keymap.of([
          indentWithTab,
          {
            key: "Shift-ـ",
            run: (view) => {
              view.dispatch(view.state.replaceSelection("_"))
              return true
            }
          }
        ]),
        EditorView.updateListener.of((view) => {
          if (view.docChanged) { this.#sync() }
        }),
        ayuLight,
      ],
      parent: this.editorTarget,
    })

    requestAnimationFrame(() => {
      this.editor.focus()

      this.loadingTarget.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = () => {
        this.loadingTarget.remove()
      }
    })
  }

  disconnect() {
    this.editor.destroy()
  }

  #sync() {
    this.inputTarget.value = this.editor.state.doc.toString()
  }
}
