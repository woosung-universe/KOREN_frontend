import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DiagnosisTable = () => {
  const data = [
    { id: "I939485", type: "홍길동", detail: "가나다라마 바사...", result: "피부암 양성" },
    { id: "I939436", type: "아무개", detail: "가나다라마바사...", result: "피부암 음성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
    { id: "K345334", type: "김이박", detail: "가나다라마바사...", result: "피부암 양성" },
  ];

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-center font-medium text-foreground">진단번호</TableHead>
            <TableHead className="text-center font-medium text-foreground">환자명</TableHead>
            <TableHead className="text-center font-medium text-foreground">진단내역</TableHead>
            <TableHead className="text-center font-medium text-foreground">진단결과</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="hover:bg-muted/30">
              <TableCell className="text-center text-sm">{item.id}</TableCell>
              <TableCell className="text-center text-sm">{item.type}</TableCell>
              <TableCell className="text-center text-sm">{item.detail}</TableCell>
              <TableCell className="text-center text-sm">{item.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-center py-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 rounded text-sm bg-primary text-primary-foreground">1</button>
            <button className="w-8 h-8 rounded text-sm hover:bg-muted">2</button>
            <button className="w-8 h-8 rounded text-sm hover:bg-muted">3</button>
            <button className="w-8 h-8 rounded text-sm hover:bg-muted">4</button>
            <button className="w-8 h-8 rounded text-sm hover:bg-muted">5</button>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTable;