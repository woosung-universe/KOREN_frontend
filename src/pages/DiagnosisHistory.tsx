import Header from "@/components/Header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DiagnosisHistory = () => {
  const [selectedDate, setSelectedDate] = useState("2025년 8월 5일");
  const [currentMonth, setCurrentMonth] = useState("August 2025");
  
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

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const calendarDays = [
    [27, 28, 29, 30, 31, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 1, 2, 3, 4, 5, 6]
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Exploration</h1>
          <div className="flex items-center gap-2">
            <span className="text-xl text-gray-700">Data Exploration</span>
            <span className="text-gray-400">🔗</span>
          </div>
          <p className="text-gray-500 mt-2">Here you can see your the specification of the data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose a file</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Drag and drop file here</p>
                <p className="text-sm text-gray-500 mb-4">Limit 200MB per file</p>
                <Button variant="outline" size="sm">Browse files</Button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">날짜 선택</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-gray-900">{currentMonth}</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-xs text-gray-500 py-2 font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.flat().map((day, index) => {
                    const isCurrentMonth = day <= 31 && day >= 1;
                    const isSelected = day === 5;
                    
                    return (
                      <button
                        key={index}
                        className={`
                          h-8 text-sm rounded transition-colors
                          ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                          ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-blue-50 rounded p-3 text-center">
                  <p className="text-blue-700 text-sm font-medium">{selectedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Dataset Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Your dataset</h3>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium text-gray-900 min-w-[120px]">image_name</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[100px]">patient_id</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[80px]">sex</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[100px]">age_approx</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[160px]">anatom_site_general_challenge</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[80px]">target</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[100px]">diagnosis</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[130px]">benign_malignant</TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[120px]">location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-sm text-blue-600 font-mono">{item.image_name}</TableCell>
                        <TableCell className="text-sm text-blue-600 font-mono">{item.patient_id}</TableCell>
                        <TableCell className="text-sm">{item.sex}</TableCell>
                        <TableCell className="text-sm">{item.age_approx}</TableCell>
                        <TableCell className="text-sm">{item.anatom_site_general_challenge}</TableCell>
                        <TableCell className="text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.target === 0 ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                          }`}>
                            {item.target}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.diagnosis === "benign" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {item.diagnosis}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.benign_malignant === "benign" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {item.benign_malignant}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{item.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded text-sm bg-blue-600 text-white">1</button>
                    <button className="w-8 h-8 rounded text-sm hover:bg-gray-100">2</button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">총 20개 레코드 | 악성: 7개 | 양성: 13개</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHistory; 