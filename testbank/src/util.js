// preFilters is a dictionary of filters, ex: { course: [ { name: 'COM SCI', number: 33 } ] }
// filterItems is an array filters, ex: [ { field: 'Course', data: { name: 'COM SCI', number: 33 } } ]
const aggregateFilters = (preFilters, filterItems = []) => {
  let filters = {}
  for (const { field, data } of [...preFilters, ...filterItems]) {
    const filterKey = field.toLowerCase()
    if (filters[filterKey]) {
      filters[filterKey] = [ ...filters[filterKey], data ]
    }
    else {
      filters[filterKey] = [ data ]
    }
  }
  return filters
}

export { aggregateFilters }