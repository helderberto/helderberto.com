import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackConsole,
} from '@codesandbox/sandpack-react'
import { dracula } from '@codesandbox/sandpack-themes'
import { createFileMap } from './createFileMap'

const SandpackEditor = ({
  children,
  dependencies,
  template = 'react-ts',
  showPreview = true,
  showConsole = true,
  readOnly = false,
}) => {
  const files = createFileMap(children)

  return (
    <SandpackProvider
      template={template}
      theme={dracula}
      files={files}
      customSetup={{
        dependencies,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          readOnly={readOnly}
          showLineNumbers={false}
          showInlineErrors
          wrapContent
        />
      </SandpackLayout>

      {showPreview || showConsole ? (
        <SandpackLayout className="sp-layout-bottom">
          <SandpackPreview hidden={!showPreview} />
          <SandpackConsole hidden={!showConsole} />
        </SandpackLayout>
      ) : null}
    </SandpackProvider>
  )
}

export default SandpackEditor
