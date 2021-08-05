export function parseFuncName(name, sign = '_') {
  let pos = name.indexOf(sign)
  if (pos >= 0) {
    let new_str = name.slice(0, pos)
      + name[pos + 1].toUpperCase()
      + name.slice(pos + 2)
    return parseFuncName(new_str, sign)
  } else {
    return name
  }
}

export function n(n) {
  return `\f`.repeat(n)
}