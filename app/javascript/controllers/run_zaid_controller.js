import { Controller } from "@hotwired/stimulus"

import { RubyVM } from "@ruby/wasm-wasi"
import { File, WASI, OpenFile, ConsoleStdout } from "@bjorn3/browser_wasi_shim"

import ruby from "./zaid.wasm"

// Connects to data-controller="run-zaid"
export default class extends Controller {
  static targets = ["input", "output", "run"]

  async connect() {
    try {
      const module = await ruby()
      this.#initializeOutput()
      this.#initializeVM(module)
    } catch (error) {
      this.outputTarget.innerHTML = "حدث خطأ أثناء تهيئة المساحة التجريبية للغة زيد، حاول مرةً أخرى رجاءً."
    }
  }

  async run() {
    try {
      this.#preRun()

      await new Promise(resolve => setTimeout(resolve, 100));

      const code = `
      require 'zaid'

      Zaid::Interpreter.new.eval(${JSON.stringify(this.inputTarget.value)})
      `

      this.vm.eval(code)
      const output = this.vm.$output.flush()
      this.outputTarget.innerHTML = this.#formatOutput(output)

      this.#postRun()
    } catch (error) {
      this.outputTarget.innerHTML = `خطأ: ${error.message}`
    }
  }

  #initializeOutput() {
    this.output = []
    this.output.flush = () => this.output.splice(0, this.output.length).join("\n")
  }

  async #initializeVM(module) {
    this.fds = [
      new OpenFile(new File([])),
      ConsoleStdout.lineBuffered(this.#setStdout.bind(this)),
      ConsoleStdout.lineBuffered(this.#setStderr.bind(this))
    ]

    this.wasi = new WASI([], [], this.fds, { debug: false })
    this.vm = new RubyVM()

    this.imports = {
      wasi_snapshot_preview1: this.wasi.wasiImport,
    }

    this.vm.addToImports(this.imports)

    this.instance = await WebAssembly.instantiate(module, this.imports)
    await this.vm.setInstance(this.instance)

    this.wasi.initialize(this.instance)
    this.vm.initialize()

    this.vm.$output = this.output
  }

  #preRun() {
    this.runTargets.forEach(target => { target.disabled = true })
    this.outputTarget.innerHTML = "جارٍ التنفيذ..."
  }

  #postRun() {
    this.runTargets.forEach(target => { target.disabled = false })
  }

  #formatOutput(output) {
    return output
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>')
  }

  #setStdout(value) {
    this.output.push(value)
  }

  #setStderr(value) {
    this.output.push(`<span class="text-red-500">[تنبيه] ${value}</span>`)
  }
}
