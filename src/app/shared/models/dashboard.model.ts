export interface TopUser {
    username: string;
    nb: number;
    Domain?: string;
}

export interface ParticipantsDetails {
    nbParticipants: number;
    topParticipants: TopUser[];
    topParticipantsWithDomains: TopUser[];
}

export interface TrainersDetails {
    nbTrainers: number;
    internalTrainersCount: number;
    externalTrainersCount: number;
    topTrainers: TopUser[];
}
export interface TrainingsDetails {
    nbTrainings: number;
    totalIncome: number;
    trainingsPerDomain: {
        domainName: string;
        count: number;
    }[];
}

export interface DashboardData {
    participants: ParticipantsDetails;
    trainers: TrainersDetails;
    trainings: TrainingsDetails;
    otherDetails: OtherDetails;
}
export interface OtherDetails {
    nbOfMale: number;
    nbOfFemale: number;
}

// Dashboard data structure
export interface DashboardData {
    participants: ParticipantsDetails;
    trainers: TrainersDetails;
    trainings: TrainingsDetails;
    otherDetails: OtherDetails;
}

// Chart-friendly formats
export interface ChartSeries {
    name: string;
    value: number;
}

export interface HeatMapItem {
    name: string;
    series: ChartSeries[];
}