You are a senior backend engineer. I want you to implement a **future-proof file upload system** for an Express.js \+ TypeScript backend using clean architecture principles.

## **Context**

* I currently want to store uploaded images **locally (filesystem)** for MVP  
* In the future, I will switch to **cloud storage (e.g., S3 or Cloudflare R2)** without changing business logic or database schema

---

## **Goal**

Design and implement a **pluggable storage system** where:

* Today → uses local filesystem  
* Tomorrow → can switch to cloud storage  
* No changes required in controllers, services, or DB schema

---

## **Requirements**

### **1\. Storage Abstraction (CRITICAL)**

Create an interface:

export interface StorageService {  
  upload(file: Express.Multer.File, options?: { folder?: string }): Promise\<string\>;  
  delete?(fileUrl: string): Promise\<void\>;  
}

---

### **2\. Local Storage Implementation**

Create:

class LocalStorageService implements StorageService

Requirements:

* Save files under `/uploads/{folder}/`  
* Generate unique filenames (UUID \+ sanitized original name)  
* Return a full public URL:  
  `${BASE_URL}/uploads/{folder}/{filename}`  
* Use environment variable:  
  `BASE_URL=http://localhost:3000`  
* Ensure directories are created if not existing

---

### **3\. Future Cloud Stub (IMPORTANT)**

Create a placeholder:

class S3StorageService implements StorageService

* Do NOT fully implement S3  
* Just structure it properly so it can be implemented later  
* Return a mock URL like:  
  `https://cdn.example.com/{folder}/{filename}`

---

### **4\. Storage Factory (Dynamic Switching)**

Create a factory:

export const storageService: StorageService

Logic:

* If `process.env.STORAGE_TYPE === "s3"` → use S3StorageService  
* Otherwise → use LocalStorageService

---

### **5\. Express Upload Setup**

* Use multer with memory storage  
* Validate:  
  * Max file size (2MB)  
  * Allowed types: jpeg, png, webp  
* Do NOT store files directly via multer disk storage

---

### **6\. Static File Serving (Local Only)**

Configure Express:

app.use('/uploads', express.static(path.resolve('uploads')));

---

### **7\. Advert Package Integration**

Update the AdvertPackage model usage:

* Add `imageUrl: string | null`

When creating/updating:

const imageUrl \= await storageService.upload(file, {  
  folder: 'advert-packages'  
});

Store only:

imageUrl

---

### **8\. Clean Architecture Rules**

* Controllers should NOT know storage details  
* No direct fs usage outside LocalStorageService  
* No hardcoded URLs  
* Use environment variables

---

### **9\. Security & Safety**

* Sanitize file names  
* Prevent path traversal  
* Only allow safe MIME types  
* Generate unique filenames (UUID)

---

### **10\. Bonus (Optional but preferred)**

* Add helper function to extract file path from URL (for delete later)  
* Add logging for uploads  
* Add error handling with meaningful messages

---

## **Deliverables**

* Fully working upload system  
* Clean folder structure:  
  * /services/storage/  
  * /controllers/  
  * /middlewares/  
* Example route:  
  POST /advert-packages with image upload  
* Code should be production-quality and easy to extend

---

## **Important Principle**

Design this as if the system is already using cloud storage — even though it currently uses local disk.

Do NOT take shortcuts that will make future migration harder.

