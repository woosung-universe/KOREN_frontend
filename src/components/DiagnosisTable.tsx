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
    { image_name: "ISIC_2637011", patient_id: "IP_7279968", sex: "male", age_approx: 45.0, anatom_site_general_challenge: "head/neck", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "head/neck" },
    { image_name: "ISIC_0015719", patient_id: "IP_3075186", sex: "female", age_approx: 45.0, anatom_site_general_challenge: "upper extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "upper extremity" },
    { image_name: "ISIC_0052212", patient_id: "IP_2842074", sex: "female", age_approx: 50.0, anatom_site_general_challenge: "lower extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "lower extremity" },
    { image_name: "ISIC_0068279", patient_id: "IP_6890425", sex: "female", age_approx: 45.0, anatom_site_general_challenge: "head/neck", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "head/neck" },
    { image_name: "ISIC_0074268", patient_id: "IP_8723313", sex: "female", age_approx: 55.0, anatom_site_general_challenge: "upper extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "upper extremity" },
    { image_name: "ISIC_0074311", patient_id: "IP_2950485", sex: "female", age_approx: 40.0, anatom_site_general_challenge: "lower extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "lower extremity" },
    { image_name: "ISIC_0098742", patient_id: "IP_1234567", sex: "male", age_approx: 65.0, anatom_site_general_challenge: "torso", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "torso" },
    { image_name: "ISIC_0102341", patient_id: "IP_7896543", sex: "male", age_approx: 70.0, anatom_site_general_challenge: "lower extremity", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "lower extremity" },
    { image_name: "ISIC_0112342", patient_id: "IP_4567890", sex: "female", age_approx: 35.0, anatom_site_general_challenge: "torso", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "torso" },
    { image_name: "ISIC_0123456", patient_id: "IP_1112131", sex: "male", age_approx: 60.0, anatom_site_general_challenge: "upper extremity", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "upper extremity" },
    { image_name: "ISIC_0134567", patient_id: "IP_2223242", sex: "female", age_approx: 30.0, anatom_site_general_challenge: "lower extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "lower extremity" },
    { image_name: "ISIC_0145678", patient_id: "IP_3334353", sex: "male", age_approx: 85.0, anatom_site_general_challenge: "head/neck", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "head/neck" },
    { image_name: "ISIC_0156789", patient_id: "IP_4445464", sex: "female", age_approx: 50.0, anatom_site_general_challenge: "torso", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "torso" },
    { image_name: "ISIC_0167890", patient_id: "IP_5556575", sex: "male", age_approx: 42.0, anatom_site_general_challenge: "upper extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "upper extremity" },
    { image_name: "ISIC_0178901", patient_id: "IP_6667686", sex: "female", age_approx: 58.0, anatom_site_general_challenge: "lower extremity", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "lower extremity" },
    { image_name: "ISIC_0189012", patient_id: "IP_7778797", sex: "male", age_approx: 49.0, anatom_site_general_challenge: "head/neck", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "head/neck" },
    { image_name: "ISIC_0190123", patient_id: "IP_8889908", sex: "female", age_approx: 64.0, anatom_site_general_challenge: "torso", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "torso" },
    { image_name: "ISIC_0201234", patient_id: "IP_9991011", sex: "male", age_approx: 33.0, anatom_site_general_challenge: "upper extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "upper extremity" },
    { image_name: "ISIC_0212345", patient_id: "IP_0001213", sex: "female", age_approx: 37.0, anatom_site_general_challenge: "lower extremity", target: 0, diagnosis: "benign", benign_malignant: "benign", location: "lower extremity" },
    { image_name: "ISIC_0223456", patient_id: "IP_1314151", sex: "male", age_approx: 55.0, anatom_site_general_challenge: "torso", target: 1, diagnosis: "malignant", benign_malignant: "malignant", location: "torso" }
  ];

  const getKoreanLocation = (location: string) => {
    const locationMap: { [key: string]: string } = {
      "head/neck": "머리/목",
      "upper extremity": "상지",
      "lower extremity": "하지",
      "torso": "몸통"
    };
    return locationMap[location] || location;
  };

  const getKoreanSex = (sex: string) => {
    return sex === "male" ? "남성" : "여성";
  };

  const getKoreanDiagnosis = (diagnosis: string) => {
    return diagnosis === "benign" ? "양성" : "악성";
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-center font-medium text-foreground">이미지 ID</TableHead>
            <TableHead className="text-center font-medium text-foreground">환자 ID</TableHead>
            <TableHead className="text-center font-medium text-foreground">환자 정보</TableHead>
            <TableHead className="text-center font-medium text-foreground">부위</TableHead>
            <TableHead className="text-center font-medium text-foreground">진단결과</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="hover:bg-muted/30">
              <TableCell className="text-center text-sm">{item.image_name}</TableCell>
              <TableCell className="text-center text-sm">{item.patient_id}</TableCell>
              <TableCell className="text-center text-sm">{getKoreanSex(item.sex)}, {item.age_approx}세</TableCell>
              <TableCell className="text-center text-sm">{getKoreanLocation(item.location)}</TableCell>
              <TableCell className="text-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.benign_malignant === "benign" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {getKoreanDiagnosis(item.benign_malignant)}
                </span>
              </TableCell>
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