import React, { useEffect, useState } from 'react'
import { analyzeDevelopmentDetails, DevelopmentWarning, DevelopmentWarningTuple } from "../data/analyzeDevelopmentDetails";
import { fetchChildRecords, fetchDevelopmentData } from "../data/fetchDevelopmentDetails";

const WarningLabels: Record<DevelopmentWarning, (record: Aha.RecordUnion) => string> = {
  NO_ASSIGNEE: (record) => 'is not assigned to anyone',
  NO_DUE_DATE: (record) => 'does not have a due date',
  NO_START_DATE: (record) => 'does not have a start date',
  NO_ESTIMATE: (record) => 'is not estimated',
  NO_TEAM: (record) => 'is not assigned to a team',
  LATE_START: (record) => `is past its scheduled start date (${record.typename !== 'Requirement' && record.startDate})`,
  PAST_DUE: (record) => `is past its scheduled due date (${record.typename !== 'Requirement' && record.dueDate})`,
  DELAYING_LAUNCH: (record) => `is past the release launch (${record.release.releaseDate})`
}

const Warning = ({ record, warning }) => {
  const openDrawer = (e) => {
    e.preventDefault();
    aha.drawer.showRecord(record);
  }

  return <div>
    <aha-icon icon="fa-regular fa-warning" style={{ color: "var(--aha-orange-600)", marginRight: 4 }} />
    <a href={record.path} onClick={openDrawer}>{record.referenceNum}</a>
    &nbsp;
    {WarningLabels[warning](record) || warning}
  </div>
}

interface DevelopmentWarningProps {
  record: Aha.RecordUnion | Aha.Release
}

export const DevelopmentWarnings = ({ record }: DevelopmentWarningProps) => {
  const [warnings, setWarnings] = useState<DevelopmentWarningTuple[]>([])
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {
    (async () => {
      if (record.typename === 'Release') {
        const features = await fetchChildRecords(record)
        let warnings = features.reduce((arr, f) => {
          arr.push(...analyzeDevelopmentDetails(f))
          return arr
        }, [])
        setWarnings(warnings)
      } else {
        await fetchDevelopmentData(record)
        setWarnings(analyzeDevelopmentDetails(record))
      }

      setLoading(false)
    })()
  }, [record])

  if (loading) return <aha-spinner />

  if (warnings.length === 0) return <span className="text-muted">No warnings</span>

  return <>
    <h5>Found {warnings.length} development warnings</h5>
    {
      warnings.map(([r, w]) => (
        <Warning record={r} warning={w} />
      ))
    }
  </>
}