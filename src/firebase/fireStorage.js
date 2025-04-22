import { firebaseApp } from "@/firebase/firebaseConfig";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const fireStorage = getStorage(firebaseApp.firebaseApp);
export default fireStorage;

export async function downloadUrl(fullPath) {
  return await getDownloadURL(ref(fireStorage, fullPath));
}
