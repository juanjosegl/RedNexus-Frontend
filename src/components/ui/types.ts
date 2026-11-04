export interface FieldOption {
  value: string
  label: string
}

export interface TextFieldProps {
  id: string
  label: string
  modelValue: string
  name?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface TextAreaFieldProps extends TextFieldProps {
  rows?: number
  maxlength?: number
}

export interface SelectFieldProps {
  id: string
  label: string
  modelValue: string
  options: FieldOption[]
  name?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}
