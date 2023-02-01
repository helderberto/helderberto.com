import { Sandpack } from '@codesandbox/sandpack-react'
import { dracula } from '@codesandbox/sandpack-themes'

const CodeEditor = (props) => {
  const { template = 'react', children, metastring, externalResources = [] } = props
  const [filename, ...params] = metastring.split(' ')
  const filePath = (template === 'react' ? '/' : '/src/') + filename

  let active = false
  let hidden = false
  let showConsole = false

  if (params.includes('hidden')) {
    hidden = true
  }

  if (params.includes('active')) {
    active = true
  }

  if (params.includes('showConsole')) {
    showConsole = true
  }

  return (
    <Sandpack
      template={template}
      theme={dracula}
      files={{
        [filePath]: {
          code: children,
          active,
          hidden,
        },
      }}
      options={{
        showLineNumbers: false, // default - true
        resizablePanels: true,
        showConsole,
        externalResources,
      }}
    />
  )
}

export default CodeEditor
