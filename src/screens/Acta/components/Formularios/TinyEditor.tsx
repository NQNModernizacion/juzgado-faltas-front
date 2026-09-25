import { memo } from 'react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import { Editor } from '@tinymce/tinymce-react'

// Importaciones locales de TinyMCE (Self-Hosted, 100% offline / libre)
import 'tinymce/tinymce'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin.css'
import '../tinymce-es'

// Plugins necesarios para documentos legales y sentencias
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'

export interface TinyEditorProps {
  value: string
  onChange: (content: string) => void
  onInit?: (editor: TinyMCEEditor) => void
  height?: number
  disabled?: boolean
}

export const TinyEditor = memo(({ value, onChange, onInit, height = 550, disabled = false }: TinyEditorProps) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Editor
        licenseKey="gpl"
        disabled={disabled}
        onInit={(_evt, editor) => {
          if (onInit) {
            onInit(editor)
          }
        }}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: 'edit view insert format tools table',
          promotion: false,
          branding: false,
          language: 'es',
          plugins: ['advlist', 'autolink', 'lists', 'link', 'charmap', 'searchreplace', 'fullscreen', 'pagebreak', 'table', 'wordcount'],
          toolbar: [
            'undo redo | blocks fontfamily fontsize | bold italic underline forecolor backcolor',
            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
            'table | pagebreak searchreplace | fullscreen',
          ].join(' | '),
          font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt',
          font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace;',
          pagebreak_separator: '<div class="page-break" style="page-break-after: always; break-after: page;"></div>',
          pagebreak_split_block: true,
          content_style:
            'body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; padding: 15px; color: #222; } table { border-collapse: collapse; width: 100%; } table, th, td { border: 1px solid #aaa; } th, td { padding: 6px; } .mce-pagebreak { cursor: default; display: block; border: 0; border-top: 2px dashed #dc2626; width: 100%; height: 8px; margin: 25px 0 15px 0; background-color: #fee2e2; page-break-before: always; }',
          table_default_attributes: { border: '1' },
          table_default_styles: { 'border-collapse': 'collapse', width: '100%' },
          skin: false,
          content_css: false,
        }}
      />
    </div>
  )
})

TinyEditor.displayName = 'TinyEditor'
