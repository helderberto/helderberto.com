import { Sandpack } from '@codesandbox/sandpack-react'
import { dracula } from '@codesandbox/sandpack-themes'

const CustomSandpack = (props) => {
  const { template = 'react', children, metastring, externalResources = [] } = props
  const [filename, ...params] = metastring.split(' ')
  const filePath = (template === 'react' ? '/' : '/src/') + filename

  let active = false
  let hidden = false
  let showConsole = false
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
        readOnly,
        wrapContent: true,
        externalResources,
      }}
    />
  )
}

export default CustomSandpack
