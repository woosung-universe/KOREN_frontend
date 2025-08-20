export interface DiagnosisData {
  image_name: string;
  patient_id: string;
  sex: string;
  age_approx: number;
  anatom_site_general_challenge: string;
  target: number;
  diagnosis: string;
  benign_malignant: string;
  location: string;
}

export const dummyDiagnosisData: DiagnosisData[] = [
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