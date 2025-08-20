import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { dummyDiagnosisData, DiagnosisData } from "@/data/diagnosisData";

interface DatasetContextValue {
	records: DiagnosisData[];
	addRecord: (record: DiagnosisData) => void;
}

const DatasetContext = createContext<DatasetContextValue | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: ReactNode }) => {
	const [records, setRecords] = useState<DiagnosisData[]>(dummyDiagnosisData);

	const addRecord = (record: DiagnosisData) => {
		setRecords(prev => [record, ...prev]);
	};

	const value = useMemo<DatasetContextValue>(() => ({ records, addRecord }), [records]);
	return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};

export const useDataset = () => {
	const ctx = useContext(DatasetContext);
	if (!ctx) throw new Error("useDataset must be used within DatasetProvider");
	return ctx;
}; 