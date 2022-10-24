export enum DevelopmentWarning {
  NoEstimate = "NO_ESTIMATE",
  NoAssignee = "NO_ASSIGNEE",
  NoStartDate = "NO_START_DATE",
  NoDueDate = "NO_DUE_DATE",
  NoTeam = "NO_TEAM",
  LateStart = "LATE_START",
  PastDue = "PAST_DUE",
  DelayingLaunch = "DELAYING_LAUNCH"
}

export interface WarningSettings {
  warningDates: boolean
  warningEstimates: boolean
  warningLate: boolean
  warningAssignment: boolean
}

export type DevelopmentWarningTuple = [Aha.RecordUnion, DevelopmentWarning]

export function analyzeDevelopmentDetails(record: Aha.RecordUnion, settings: WarningSettings) {
  const warnings: DevelopmentWarningTuple[] = []
  const now = Date.now()
  const warn = (warning: DevelopmentWarning) => {
    warnings.push([record, warning])
  }

  // No warnings if the record is closed
  if (['DONE', 'SHIPPED', 'WONT_DO'].includes(record.teamWorkflowStatus.internalMeaning)) {
    return []
  }

  if (settings.warningEstimates && !record.originalEstimate) {
    warn(DevelopmentWarning.NoEstimate)
  }

  if (settings.warningAssignment) {
    if (!record.assignedToUser.id) {
      warn(DevelopmentWarning.NoAssignee)
    }

    if (!record.team) {
      warn(DevelopmentWarning.NoTeam)
    }
  }

  if (record.typename !== 'Requirement') {
    if (settings.warningDates) {
      if (!record.startDate) {
        warn(DevelopmentWarning.NoStartDate)
      }

      if (!record.dueDate) {
        warn(DevelopmentWarning.NoDueDate)
      }
    }

    if (settings.warningLate) {
      if (record.startDate && Date.parse(record.startDate) < now && record.teamWorkflowStatus.internalMeaning === 'NOT_STARTED') {
        warn(DevelopmentWarning.LateStart)
      }

      if (record.dueDate && Date.parse(record.dueDate) < now && record.teamWorkflowStatus.internalMeaning !== 'DONE') {
        warn(DevelopmentWarning.PastDue)
      }

      if (record.release.releaseDate && Date.parse(record.release.releaseDate) < now && record.teamWorkflowStatus.internalMeaning !== 'DONE') {
        warn(DevelopmentWarning.DelayingLaunch)
      }
    }
  }

  return warnings
}