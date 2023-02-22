import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackConsole,
} from '@codesandbox/sandpack-react'
import { dracula } from '@codesandbox/sandpack-themes'

const CustomSandpack = (props) => {
  let { template = 'react', children, metastring, externalResources = [] } = props
  const [filename, ...params] = metastring.split(' ')
  const filePath = (template === 'react' ? '/' : '/src/') + filename

  let active = false
  let hidden = false
  let showConsole = false
  let showPreview = true
  let readOnly = false

  if (params.includes('hidden')) {
    hidden = true
  }

  if (params.includes('active')) {
    active = true
  }

  if (params.includes('showConsole')) {
    showConsole = true
  }

  if (params.includes('readOnly')) {
    readOnly = true
  }

  if (params.includes('hidePreview')) {
    showPreview = false
  }

  return (
    <SandpackProvider
      template={template}
      theme={dracula}
      files={{
        [filePath]: {
          code: children,
          active,
          hidden,
        },
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showLineNumbers={false}
          showTabs={false}
          readOnly={readOnly}
          wrapContent
          externalResources={externalResources}
        />
      </SandpackLayout>

      {showConsole || showPreview ? (
        <SandpackLayout>
          <SandpackPreview hidden={!showPreview} />
          <SandpackConsole hidden={!showConsole} />
        </SandpackLayout>
      ) : null}
    </SandpackProvider>
  )
}

export default CustomSandpack
