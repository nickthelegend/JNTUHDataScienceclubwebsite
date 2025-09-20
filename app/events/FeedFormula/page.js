import fs from "fs";
import path from "path";
import DynamicImageCard from "@/app/_components/DynamicImageCard";
export default function FeedFormulaGallery() {
  const imagesDirectory = path.join(process.cwd(), "public/FeedFormula");
  let imageData = [];
  try {
    const fileNames = fs.readdirSync(imagesDirectory);
    const imageFiles = fileNames.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    imageData = imageFiles.map((file) => ({
      src: `/FeedFormula/${file}`,
      alt: file.replace(/\.[^/.]+$/, "").replace(/_/g, " "), 
    }));
  } catch (error) {
    console.error("Error reading the image directory:", error);
  }

  return (
    <>
      <div className="min-h-screen p-10 bg-gradient-to-tr from-violet-200 via-40% via-slate-50  to-blue-200">
        <div className="my-32"></div>
        <h1 className="font-open-sans text-5xl font-bold py-8 text-center underline decoration-slice underline-offset-4 hover:underline-offset-8">
          The Feed Formula 
        </h1>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {imageData.length > 0 ? (
            imageData.map((image, index) => (
              <DynamicImageCard key={index} src={image.src} alt={image.alt} />
            ))
          ) : (
            <p className="col-span-3 text-center text-lg">No images found.</p>
          )}
        </div>
      </div>
    </>
  );
}
