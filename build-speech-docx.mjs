import { readFile, writeFile } from 'node:fs/promises'
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'

const source = await readFile(new URL('./SPEECH.md', import.meta.url), 'utf8')
const lines = source.replace(/\r\n/g, '\n').split('\n')

function runs(text, extra = {}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return parts.map((part) => {
    const bold = part.startsWith('**') && part.endsWith('**')
    return new TextRun({
      text: bold ? part.slice(2, -2) : part,
      bold,
      ...extra,
    })
  })
}

const children = []

for (const raw of lines) {
  const line = raw.trimEnd().replace(/`/g, '')
  if (!line.trim()) continue
  if (line.trim() === '---') continue

  if (line.startsWith('### ')) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 100 },
      children: runs(line.slice(4), { color: '9A6A00', bold: true }),
    }))
    continue
  }

  if (line.startsWith('## ')) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 260, after: 120 },
      children: runs(line.slice(3), { color: '0B1119' }),
    }))
    continue
  }

  if (line.startsWith('# ')) {
    children.push(new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 180 },
      children: runs(line.slice(2), { color: '0B1119' }),
    }))
    continue
  }

  if (line.startsWith('- ')) {
    children.push(new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 80 },
      children: runs(line.slice(2)),
    }))
    continue
  }

  children.push(new Paragraph({
    spacing: { after: 130, line: 300 },
    children: runs(line),
  }))
}

// A thin visual separator after the role/timing block.
children.splice(3, 0, new Paragraph({
  spacing: { before: 100, after: 100 },
  border: {
    bottom: { color: 'FCB131', size: 12, space: 1, style: 'single' },
  },
  children: [new TextRun('')],
}))

const doc = new Document({
  creator: 'Olympic Games Interactive',
  title: 'Интерактивное путешествие сквозь историю Олимпийских игр — речь',
  description: 'Речь на защиту проекта, 6:45, Максим и Ваня',
  styles: {
    default: {
      document: {
        run: { font: 'Arial', size: 24, color: '1F2933' },
        paragraph: { spacing: { line: 300 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 900, right: 900, bottom: 900, left: 900 },
      },
    },
    children,
  }],
})

const buffer = await Packer.toBuffer(doc)
await writeFile(new URL('./speech.docx', import.meta.url), buffer)
console.log(`speech.docx written: ${buffer.length} bytes`)
