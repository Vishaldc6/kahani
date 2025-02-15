import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import uuid from "react-native-uuid";

// adding document into the collection
export const addDocument = async (
  _collection: string,
  _document: string,
  data: any
) => {
  await setDoc(doc(db, _collection, _document), {
    ...data,
    created_at: serverTimestamp(),
  });
};

// updating document
export const updateDocument = async (
  _collection: string,
  _document: string,
  data: any
) => {
  await updateDoc(doc(db, _collection, _document), {
    ...data,
    updated_at: serverTimestamp(),
  });
};

// delete document
export const removeDocument = async (
  _collection: string,
  _document: string
) => {
  await deleteDoc(doc(db, _collection, _document));
};

// fetches document
export const getDocument = async (_collection: string, _document: string) => {
  await getDoc(doc(db, _collection, _document));
};

// generate unique id for the every document
export const generateUniqueId = async (_collection: string, field: string) => {
  let _id = 0;
  const lastDoc = query(
    collection(db, _collection),
    orderBy(field, "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(lastDoc);

  if (querySnapshot.empty) {
    console.log("empty!!");
    ++_id;
  } else {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      _id = Number(doc.id.substring(1)) + 1;
    });
  }

  let final_id =
    _collection.charAt(0) + _id.toString().padStart(2, "0") + "_" + uuid.v4();
  console.log({
    _id,
    genid: final_id,
  });
  return final_id;
};
