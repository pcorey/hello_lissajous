import React from "react";
import getPixelRatio from "./getPixelRatio";
import styled from "styled-components";
import { useEffect } from "react";
import { useRef } from "react";

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Lissajous = ({ a, b }) => {
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");

    let ratio = getPixelRatio(context);
    let width = window
      .getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);
    let height = width;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.lineWidth = 1;
    context.lineCap = "square";
    context.fillStyle = "rgba(255,255,255,0.01)";
    context.strokeStyle = "#333";

    let d = Math.PI / 2;
    let t = 0;
    let dt = 0.01;
    let scale = (width / Math.max(a, b)) * 0.5;

    let cx = (width * ratio) / 2;
    let cy = (height * ratio) / 2;

    let x = cx + a * Math.sin(d) * scale;
    let y = cy + b * Math.sin(0) * scale;

    let requestId;
    const render = () => {
      context.fillRect(0, 0, width * ratio, height * ratio);

      context.beginPath();
      context.moveTo(x, y);
      x = cx + a * Math.sin(a * t + d) * scale;
      y = cy + b * Math.sin(b * t) * scale;
      context.lineTo(x, y);
      context.stroke();

      t += dt;
      requestId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(requestId);
  });

  return <Canvas ref={ref}></Canvas>;
};

export default Lissajous;
