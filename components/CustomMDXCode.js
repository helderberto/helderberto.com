import { Sandpack } from '@codesandbox/sandpack-react'
import { dracula } from '@codesandbox/sandpack-themes'

const CustomMDXCode = ({ template, filename, children, active = false }) => {
  return (
    <Sandpack
      template={template}
      theme={dracula}
      files={{
        [filename]: {
          code: children,
          active,
        },
      }}
    />
  )
}

export default CustomMDXCode
