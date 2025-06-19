export function getStatusInfo(status?: string) {
  let label = '---'
  let color: 'orange' | 'green' | 'red' | 'default' = 'default'

  if (status === 'P') {
    label = 'Pending'
    color = 'orange'
  } else if (status === 'ACTIVE') {
    label = 'Active'
    color = 'green'
  } else if (status === 'INACTIVE') {
    label = 'Inactive'
    color = 'red'
  } else if (status) {
    label = status
  }
  return { label, color }
}
