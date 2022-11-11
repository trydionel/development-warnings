import React, { useEffect, useState } from 'react'
import { groupBy } from 'lodash'
import { analyzeDevelopmentDetails, DevelopmentWarning, DevelopmentWarningTuple, WarningSettings } from "../data/analyzeDevelopmentDetails";
import { fetchChildRecords, fetchDevelopmentData } from "../data/fetchDevelopmentDetails";

const WarningLabels: Record<DevelopmentWarning, (record: Aha.RecordUnion) => string> = {
  NO_ASSIGNEE: (record) => 'is not assigned to anyone',
  NO_DUE_DATE: (record) => 'does not have a due date',
  NO_START_DATE: (record) => 'does not have a start date',
  NO_ESTIMATE: (record) => 'is not estimated',
  NO_TEAM: (record) => 'is not assigned to a team',
  LATE_START: (record) => `is past its scheduled start date (${record.typename !== 'Requirement' && record.startDate})`,
  PAST_DUE: (record) => `is past its scheduled due date (${record.typename !== 'Requirement' && record.dueDate})`,
  DELAYING_LAUNCH: (record) => `is past the release launch (${record.release.releaseDate})`,
  OVERDUE_TASKS: (record) => `has overdue to-dos`
}

const Warning = ({ record, children }) => {
  const openDrawer = (e) => {
    e.preventDefault();
    aha.drawer.showRecord(record);
  }

  return <div>
    <aha-icon icon="fa-regular fa-warning" style={{ color: "var(--aha-orange-600)", marginRight: 4 }} />
    <a href={record.path} onClick={openDrawer}>{record.referenceNum}</a>
    &nbsp;
    {children}
  </div>
}

const WarningList = ({ warnings }) => {
  return warnings.map(([r, w], i) => (
    <Warning record={r} key={i}>
      {WarningLabels[w](r) || w}
    </Warning>
  ))
}

const WarningHeaders: Record<DevelopmentWarning, string> = {
  NO_ASSIGNEE: 'No assignee',
  NO_DUE_DATE: 'No start date',
  NO_START_DATE: 'No due date',
  NO_ESTIMATE: 'No estimate',
  NO_TEAM: 'No team',
  LATE_START: 'Late to start',
  PAST_DUE: 'Past due',
  DELAYING_LAUNCH: 'Delaying launch',
  OVERDUE_TASKS: 'Overdue to-dos'
}

const GroupedWarnings = ({ warnings }) => {
  const grouped = groupBy(warnings, ([record, warning]) => warning)

  return <>
    {Object.keys(grouped).map((group) => (
      <div className="mb-6">
        <h5>{WarningHeaders[group]}</h5>
        {grouped[group].map(([record, _], i) => (
          <Warning record={record} key={i}>
            {record.name}
          </Warning>
        ))}
      </div>
    ))
    }
  </>
}

interface DevelopmentWarningProps {
  record: Aha.RecordUnion | Aha.Release
  settings: WarningSettings
}

export const DevelopmentWarnings = ({ record, settings }: DevelopmentWarningProps) => {
  const [warnings, setWarnings] = useState<DevelopmentWarningTuple[]>([])
  const [loading, setLoading] = useState<Boolean>(true)
  const isRelease = record.typename === 'Release'

  useEffect(() => {
    (async () => {
      if (isRelease) {
        const features = await fetchChildRecords(record)
        let warnings = features.reduce((arr, f) => {
          arr.push(...analyzeDevelopmentDetails(f, settings))
          return arr
        }, [])
        setWarnings(warnings)
      } else {
        await fetchDevelopmentData(record)
        setWarnings(analyzeDevelopmentDetails(record, settings))
      }

      setLoading(false)
    })()
  }, [record])

  if (loading) return <aha-spinner />

  return <>
    <h5>
      Found {warnings.length} development warnings
      &nbsp;
      <span>
        <aha-tooltip-default-trigger trigger="development-trigger-info" />
        <aha-tooltip placement="bottom" id="development-trigger-info">
          <strong className="mr-2">What is this?</strong>
          This extension is exploring concepts from <br />
          https://big.aha.io/features/A-14541. Please send feedback to Jeff.
        </aha-tooltip>
      </span>
    </h5>

    {
      isRelease ?
        <GroupedWarnings warnings={warnings} /> :
        <WarningList warnings={warnings} />
    }

  </>
}