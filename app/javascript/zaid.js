function wordObject(words) {
  var o = {}

  for (var i = 0, e = words.length; i < e; ++i) {
    o[words[i]] = true
  }

  return o
}

var keywordList = [
  "أصغر",
  "أكبر",
  "أو",
  "إذا",
  "إذن",
  "التالي",
  "باقي",
  "تستقبل",
  "تقسيم",
  "توقف",
  "خاطئ",
  "دالة",
  "زائد",
  "صحيح",
  "صفر",
  "ضرب",
  "طالما",
  "قسمة",
  "كان",
  "لا",
  "مجهول",
  "من",
  "ناقص",
  "نوع",
  "هو",
  "و",
  "وإذا",
  "وإلا",
  "واحد",
  "وهي",
  "يساوي",
], keywords = wordObject(keywordList)

function chain(newToken, stream, state) {
  state.tokenize.push(newToken)

  return newToken(stream, state)
}

function tokenBase(stream, state) {
  if (stream.eatSpace()) return null

  if (stream.sol() && (stream.match("#") || stream.match("تعليق:") || stream.match("ملاحظة:") || stream.match("سؤال:"))) {
    stream.skipToEnd()

    return "comment"
  }

  var character = stream.next()

  if (character == '"') {
    return chain(tokenString(character, "string"), stream, state)
  } else if (/[\d٠-٩]/.test(character)) {
    stream.match(/^[\d٠-٩]*(?:\.[\d٠-٩]+)?/)

    return "number"
  } else if (/[ابتةثجحخدذرزسشصضطظعغفقكلمنهوىيءآأؤإئ_ـ]/.test(character)) {
    stream.eatWhile(/[\dابتةثجحخدذرزسشصضطظعغفقكلمنهوىيءآأؤإئ_ـ٠-٩؟]/)

    return "variable"
  } else if (/[=+\-*\/\%&|!<>]/.test(character)) {
    stream.eatWhile(/[=+\-*\/\%&|!<>]/)

    return "operator"
  }

  return null
}

function tokenString(quote) {
  return function (stream, state) {
    var escaped = false, next

    while ((next = stream.next()) != null) {
      if (next == quote && !escaped) {
        state.tokenize = tokenBase
        break
      }

      escaped = !escaped && next == "\\"
    }

    return "string"
  }
}

export const zaid = {
  name: "zaid",

  startState: function (indentUnit) {
    return {
      tokenize: [tokenBase],
      indented: 0,
      context: { type: "top", indented: -indentUnit },
      continuedLine: false,
    }
  },

  token: function (stream, state) {
    if (stream.sol()) {
      state.indented = stream.indentation()
    }

    var style = state.tokenize[state.tokenize.length - 1](stream, state)

    if (style == "variable" && keywords.propertyIsEnumerable(stream.current())) {
      style = "keyword"
    }

    return style
  },

  languageData: {
    commentTokens: { line: "#" },
    autocomplete: keywordList,
    fold: "indent",
    theme: "default",
    indentWithTabs: false,
    indentUnit: 2,
  },
}
