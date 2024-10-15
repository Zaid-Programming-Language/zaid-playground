import { Controller } from "@hotwired/stimulus"

import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser"
import ruby from "./zaid.wasm"

// Connects to data-controller="run-zaid"
export default class extends Controller {
  static targets = ["input"]

  async connect() {
    const module = await ruby()
    const { vm } = await DefaultRubyVM(module)
    this.vm = vm
  }

  run() {
    const code = `
    require 'zaid'

    Zaid::Interpreter.new.eval('${this.inputTarget.value}')
    `

    this.vm.eval(code)
  }
}
