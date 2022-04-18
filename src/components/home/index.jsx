import { useState, useEffect, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { FiDownloadCloud } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";

const axios = require("axios").default;

function Home() {
  const [quote, setQuote] = useState({ id: 0, quote: "API Data not found" });
  const [reload, setRelaod] = useState(false);

  const quote_component = useRef();

  const get_quote = async () => {
    let res = await axios({
      method: "get",
      url: "https://quotes-api-smauj.azurewebsites.net/api/quoteAPI",
    });
    if (res.status === 200) {
      setQuote(res.data);
    } else {
      setQuote({ id: 0, quote: "API Data not found" });
    }
  };

  const downloadPng = useCallback(() => {
    if (quote_component.current === null) {
      return;
    }
    toPng(quote_component.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `quote-${quote.id + 1}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [quote]);

  useEffect(() => {
    get_quote();
  }, []);

  return (
    <div className="grid justify-center w-full sm:w-128 relative">
      <div
        ref={quote_component}
        className="grid justify-items-center bg-white rounded-xl  px-3 pt-4 pb-3 sm:py-5 sm:px-10 drop-shadow-2xl"
      >
        <h2 className="text-sm sm:text-md font-bold text-green-800 mt-4 text-center uppercase tracking-widest">
          Quote #{quote.id+1} - {quote.author}
        </h2>
        <hr className="hrAnimation" />
        <p className="text-2xl text-black text-center mb-4">
          "{quote.quote}"
        </p>
      </div>
      <div className="grid justify-center -bottom-5 w-full px-10 absolute">
        <div className="flex gap-7">
          <button
            onClick={downloadPng}
            className="text-center w-fit h-fit text-white bg-green-800 p-3 text-xl rounded-full"
          >
            <FiDownloadCloud />
          </button>
          <button
            onClick={() => {
              get_quote();
              setRelaod(!reload);
            }}
            className="text-center w-fit h-fit text-white bg-green-800 p-3 text-xl rounded-full"
          >
            <HiOutlineRefresh className={reload ? "refresh1" : "refresh2"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
