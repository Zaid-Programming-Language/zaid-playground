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

  showExample(event) {
    event.preventDefault()

    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: this[event.target.dataset.example]()
      }
    })

    requestAnimationFrame(() => { this.editor.focus() })
  }

  #sync() {
    this.inputTarget.value = this.editor.state.doc.toString()
  }

  comments() {
    return `# هذا تعليقٌ في لغة زيد، فأي سطرٍ يبدأ بعلامة # هو تعليق يمكنك كتابة ما تريد فيه

تعليق: وهذا أيضًا تعليق، ولكن بدون استخدام علامة #
ملاحظة: كما يمكنك كتابة ملاحظة
سؤال: أو كتابة سؤال
`
  }

  variables() {
    return `نص_زيد = "مرحبا! هذه لغة زيد"
عدد_صحيح_بالأرقام_العربية = ٣
عدد_صحيح_بالأرقام_الإنجليزية = 3
عدد_عشري_بالأرقام_العربية = ٣.١٤
عدد_عشري_بالأرقام_الإنجليزية = 3.14
قيمة_منطقية_صحيحة = صحيح
قيمة_منطقية_خاطئة = خاطئ
قيمة_غير_معروفة = مجهول
`
  }

  printing() {
    return `# تستطيع الطباعة باستخدام دالة \`اطبع\` كالتالي

عدد = ٥
اطبع(عدد)
`
  }

  comparison_operations() {
    return `# تستطيع كتابة عمليات المقارنة باللغة العربية كالتالي
٥ يساوي ٣
٥ لا يساوي ٣
٥ أكبر من ٣
٥ أصغر من ٣
٥ أكبر من أو يساوي ٣
٥ أصغر من أو يساوي ٣

# أو باستخدام العلامات كالتالي
٥ == ٣
٥ != ٣
٥ > ٣
٥ < ٣
٥ >= ٣
٥ <= ٣
`
  }

  logical_operations() {
    return `# تستطيع كتابة عمليات المنطقية باللغة العربية كالتالي
٥ > ٣ و ٥ > ٢
٥ < ٣ أو ٥ > ٢

# أو باستخدام العلامات كالتالي
٥ > ٣ && ٥ > ٢
٥ < ٣ || ٥ > ٢
`
  }

  mathematical_operations() {
    return `# تستطيع كتابة العمليات الحسابية باللغة العربية كالتالي
٥ زائد ٣
٥ ناقص ٣
٥ ضرب ٣
٥ تقسيم ٣
٥.٠ تقسيم ٣
٥ باقي قسمة ٣

# أو باستخدام العلامات كالتالي
٥ + ٣
٥ - ٣
٥ * ٣
٥ / ٣
٥.٠ / ٣
٥ % ٣
`
  }

  if_statements() {
    return `عدد = ٥

إذا كان عدد أكبر من ٣ إذن
  اطبع("العدد أكبر من ٣")
وإذا كان عدد أصغر من ٣ إذن
  اطبع("العدد أصغر من ٣")
وإلا
  اطبع("العدد يساوي ٣")
`
  }

  loop_statements() {
    return `عدد = ٥

طالما كان عدد أكبر من صفر إذن
  اطبع(عدد)

  عدد = عدد ناقص واحد
`
  }

  methods() {
    return `دالة جمع_٣_أعداد تستقبل العدد_الأول و العدد_الثاني و العدد_الثالث وهي
  العدد_الأول + العدد_الثاني + العدد_الثالث

اطبع(جمع_٣_أعداد(١، ٢، ٣))
`
  }

  classes() {
    return ` نوع الحيوانات هو
  دالة المشي وهي
    اطبع("الحيوان يمشي")

حيوان = الحيوانات.جديد

حيوان.المشي
`
  }

  arrays() {
    return `الأعداد_الأولية = [٢، ٣، ٥، ٧، ١١]

اطبع(الأعداد_الأولية.الحجم)

الأعداد_الأولية.أضف(١٣)

اطبع(الأعداد_الأولية.الحجم)
اطبع(الأعداد_الأولية[٥])
`
  }

  factorial() {
    return `دالة مضروب تستقبل عدد وهي
  حاصل_الضرب = واحد

  طالما كان عدد أكبر من صفر إذن
    حاصل_الضرب = حاصل_الضرب ضرب عدد
    عدد = عدد ناقص واحد

  حاصل_الضرب

اطبع(مضروب(٥))
`
  }

  is_prime_number() {
    return `دالة هل_العدد_أولي؟ تستقبل العدد وهي
  العدد_أولي = صحيح
  عداد = ٢

  طالما كان عداد أصغر من العدد إذن
    إذا كان العدد باقي قسمة عداد يساوي صفر إذن
      العدد_أولي = خاطئ
      توقف

    عداد = عداد زائد واحد

  العدد_أولي

إذا كان هل_العدد_أولي؟(٥) إذن
  اطبع("نعم، العدد أولي")
وإلا
  اطبع("لا، العدد ليس أوليًّا")
`
  }

  prime_numbers() {
    return `دالة هل_العدد_أولي؟ تستقبل العدد وهي
  العدد_أولي = صحيح
  عداد = ٢

  طالما كان عداد أصغر من العدد إذن
    إذا كان العدد باقي قسمة عداد يساوي صفر إذن
      العدد_أولي = خاطئ
      توقف

    عداد = عداد زائد واحد

  العدد_أولي

دالة استخراج_الأعداد_الأولية تستقبل الحد وهي
  عداد = ٢
  الأعداد_الأولية = []

  طالما كان عداد أصغر من أو يساوي الحد إذن
    إذا كان هل_العدد_أولي؟(عداد) يساوي صحيح إذن
      الأعداد_الأولية.أضف(عداد)

    عداد = عداد زائد واحد

  الأعداد_الأولية

الأعداد_الأولية = استخراج_الأعداد_الأولية(١٠٠)

عداد = صفر
طالما كان عداد أصغر من الأعداد_الأولية.الحجم إذن
  اطبع(الأعداد_الأولية[عداد])

  عداد = عداد زائد واحد
`
  }
}
