function subquery(typename, query) {
  const fields = ['referenceNum', 'path']

  if (typename != 'Requirement') {
    fields.push('startDate', 'dueDate')
  }

  return query
    .select(...fields)
    .merge({
      assignedToUser: ['id', 'name'],
      originalEstimate: ['value'],
      team: ['id', 'name'],
      iteration: ['id', 'name'],
      release: ['releaseDate'],
      teamWorkflowStatus: ['id', 'name', 'internalMeaning'],
      tasks: ['id', 'dueDate']
    })
}

export async function fetchDevelopmentData(record: Aha.RecordUnion): Promise<Aha.RecordUnion> {
  const fields = ['referenceNum', 'path']

  if (record.typename != 'Requirement') {
    fields.push('startDate', 'dueDate')
  }

  return await record.reload({
    query: subquery(record.typename, record.query)
  })
}

export async function fetchChildRecords(release: Aha.Release) {
  return await subquery('Feature', aha.models.Feature).where({ releaseId: release.id }).all()
}