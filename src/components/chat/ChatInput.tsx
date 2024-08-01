"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon, BanIcon, PaperclipIcon, X } from "lucide-react";
import "@/styles/ChatInput.css";
import Image from "next/image";

interface onSubmit {
  promptValue: string;
  imageFile?: File;
}

interface Props {
  streamingData: boolean;
  onSubmit: (data: onSubmit) => void;
  onStop?: () => void;
}

export default function ChatInput({ streamingData, onSubmit, onStop }: Props) {
  const [inputWrapperHeight, setInputWrapperHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [disableSend, setDisableSend] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [value, setValue] = useState("");
  const [setImage, setSetImage] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const refInputWrapper = useRef<HTMLDivElement>(null);
  const refTextArea = useRef<HTMLDivElement>(null);
  const refSend = useRef<HTMLButtonElement>(null);
  const refFileInput = useRef<HTMLInputElement>(null);

  const onClickSend = async () => {
    const refPrompt = refTextArea.current;
    if (!refPrompt) return;
    setValue("");

    const prompt = refPrompt.innerText;
    if (!prompt) return;

    setDisableSend(true);
    refPrompt.innerText = "";
    refPrompt.classList.add("placeholder");

    if (imageFile) {
      console.log(imageFile);

      onSubmit({
        promptValue: value,
        imageFile: imageFile,
      });
    } else {
      onSubmit({
        promptValue: value,
      });
    }

    await Promise.all([setValue(""), handleEliminateImage()]);
  };

  const handleInput = (payload: string = "change", event?: any) => {
    const chatInputWrapper = refInputWrapper.current;
    const chatTextArea = refTextArea.current;

    if (!(chatInputWrapper instanceof HTMLElement)) return;
    if (!(chatTextArea instanceof HTMLDivElement)) return;

    const handlePlaceholder = () => {
      const value = event.target.innerText;
      setValue(value);

      if (!value) {
        chatTextArea.classList.add("placeholder");
        setDisableSend(true);
      } else {
        setDisableSend(false);
        chatTextArea.classList.remove("placeholder");
      }
    };

    const handleInputWrapper = () => {
      const height = chatInputWrapper.clientHeight;

      if (height !== inputWrapperHeight) {
        if (!expanded) {
          setExpanded(true);
        }
      } else if (expanded) {
        setExpanded(false);
      }
    };

    const insertText = (text: any) => {
      var text = (event.originalEvent || event).clipboardData.getData(
        "text/plain"
      );

      document.execCommand("insertText", false, text);
    };

    switch (payload) {
      case "keyDown":
        {
          if (event.keyCode === 13 || event.key === "Enter") {
            event.preventDefault();
            onClickSend();
          }

          if (event.keyCode === 13 && event.shiftKey) {
            event.preventDefault();
            if (!event.target.innerText) return;

            insertText("\n ");
            handleInputWrapper();
            handlePlaceholder();
          }
        }
        break;
      case "input":
        {
          handleInputWrapper();
          handlePlaceholder();
        }
        break;
      case "change":
        {
          handlePlaceholder();
        }
        break;
      case "paste":
        {
          event.preventDefault();
          const text = (event.originalEvent || event).clipboardData.getData(
            "text/plain"
          );

          insertText(text);
          chatTextArea.scrollTop = chatTextArea.scrollHeight;

          handlePlaceholder();
          handleInputWrapper();
        }
        break;
    }
  };

  const handleViewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image");
    if (!isImage) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (arrayBuffer) {
        const blob = new Blob([arrayBuffer], { type: file.type });
        setImageBlob(blob);
        setSetImage(true);
      }
    };

    reader.readAsArrayBuffer(file);
  };
  const handleFileImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image");
    if (!isImage) return;

    setImageFile(file);
  };
  const handleEliminateImage = async () => {
    if (!setImage) return;

    if (refFileInput.current) {
      refFileInput.current.value = "";
    }

    await Promise.all([
      setSetImage(false),
      setImageBlob(null),
      setImageFile(null),
    ]);
  };

  useEffect(() => {
    const chatInputWrapper = document.getElementById("app_chat_input_wrapper");
    const chatTextArea = document.getElementById("app_chat_prompt_text");
    const html = document.querySelector("html");
    if (!(chatInputWrapper instanceof HTMLDivElement)) return;
    if (!(chatTextArea instanceof HTMLDivElement)) return;
    if (!(html instanceof HTMLHtmlElement)) return;

    chatInputWrapper.addEventListener("click", (event) => {
      handleInput("focus", event);
    });

    window.addEventListener("resize", () => {
      if (chatInputWrapper.clientHeight !== inputWrapperHeight) {
        if (!expanded) setExpanded(true);
      } else if (expanded) setExpanded(false);
    });

    return () => {
      chatInputWrapper.removeEventListener("click", (event) => {
        handleInput("focus", event);
      });

      window.removeEventListener("resize", () => {
        if (chatInputWrapper.clientHeight !== inputWrapperHeight) {
          if (!expanded) setExpanded(true);
        } else if (expanded) setExpanded(false);
      });
    };
  }, [inputWrapperHeight, expanded]);

  useEffect(() => {
    if (refInputWrapper.current && refTextArea.current) {
      setInputWrapperHeight(refInputWrapper.current.clientHeight);
      refTextArea.current.style.setProperty("--rows-max", "7");
    }

    return () => {
      setInputWrapperHeight(0);
    };
  }, [refInputWrapper]);

  useEffect(() => {
    setStreaming(streamingData);
  }, [streamingData]);

  return (
    <footer className="w-full min-h-[4rem] flex flex-col items-center justify-end py-2 gap-1 px-4">
      <div className="w-full items-center justify-center flex relative flex-col">
        <div
          className="w-full max-w-[45rem] bg-white/10 min-h-[3.1rem] rounded-[50rem] justify-start items-end flex data-[expanded=true]:rounded-[1.375rem] py-1.5 gap-2 relative flex-col"
          data-expanded={expanded || setImage}
        >
          {streaming && (
            <button
              className="bg-white/10 h-[2.2rem] absolute top-[-2.5rem] flex items-center justify-center gap-2 rounded-full px-2 right-0 backdrop-blur hover:bg-white/15 transition-colors duration-300 ease-in-out z-30"
              onClick={() => onStop && onStop()}
            >
              <BanIcon className="size-[1.325rem] text-white " />
              <span className="text-white font-medium text-[1rem] leading-[0] mr-2">
                Stop streaming
              </span>
            </button>
          )}
          {setImage && (
            <div className="flex w-full items-start px-3 pt-2">
              <div className="flex items-center justify-center relative">
                <button
                  className="absolute top-[-0.5rem] bg-neutral-800 rounded-full border border-white/10 size-[1.375rem] hover:border-white/20 transition-colors duration-300 ease-out flex items-center justify-center right-[-0.5rem]"
                  onClick={handleEliminateImage}
                >
                  <X
                    className="size-[1.025rem] text-white"
                    absoluteStrokeWidth
                    strokeWidth={1.5}
                  />
                </button>
                <Image
                  src={imageBlob ? URL.createObjectURL(imageBlob) : ""}
                  alt="Image selected"
                  width={1000}
                  height={1000}
                  className="pointer-events-none w-[5.75rem] h-[3.65rem] rounded-lg object-cover aspect-video"
                />
              </div>
            </div>
          )}
          <div className="flex items-end justify-center w-full h-full gap-2">
            <div>
              <label className="flex flex-col items-center justify-center cursor-pointer mb-[0.4rem] ml-[1.1rem] mr-1">
                <PaperclipIcon
                  className="size-[1.5rem] text-white"
                  absoluteStrokeWidth
                  strokeWidth={1.5}
                />
                <input
                  ref={refFileInput}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    console.log(e);

                    handleViewImage(e);
                    handleFileImage(e);
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <div
              className="flex min-w-0 flex-col flex-1 mb-[0.4rem]"
              ref={refInputWrapper}
            >
              <input
                type="text"
                name="prompt"
                className="hidden"
                defaultValue={value}
              />
              <div
                ref={refTextArea}
                className="size-full border-none overflow-auto textarea placeholder max-h-[calc(var(--rows-max)*1.5rem)] bg-transparent text-white text-[1.05rem] font-normal outline-none resize-none relative whitespace-pre-wrap text-left min-h-[1.5rem] flex-1"
                onChange={(e) => handleInput("change", e)}
                onInput={(e) => handleInput("input", e)}
                onKeyDown={(e) => handleInput("keyDown", e)}
                onPaste={(e) => handleInput("paste", e)}
                id="app_chat_prompt_text"
                data-placeholder="Send a message or image"
                contentEditable
              />
            </div>
            <div className="ml-auto">
              <button
                className="mb-[0.15rem] me-1 mr-2 flex size-8 bg-white rounded-full hover:bg-neutral-200 disabled:opacity-40 transition-[opacity,background-color] duration-300 ease-in-out items-center justify-center active:bg-neutral-400"
                disabled={streaming || disableSend}
                ref={refSend}
                type="submit"
                onClick={onClickSend}
              >
                <ArrowUpIcon
                  className="size-[1.5rem] text-black"
                  absoluteStrokeWidth
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <small className="text-neutral-400 font-normal">
        Answers may be incorrect. Design ChatGPT.
      </small>
    </footer>
  );
}
