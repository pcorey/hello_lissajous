import "lodash.product";
import React from "react";
import _ from "lodash";
import getPixelRatio from "./getPixelRatio";
import styled from "styled-components";
import { useEffect } from "react";
import { useRef } from "react";

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Lissajous = ({ n }) => {
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");

    let ratio = getPixelRatio(context);
    let width =
      window
        .getComputedStyle(canvas)
        .getPropertyValue("width")
        .slice(0, -2) * ratio;

    let height = width;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width / ratio}px`;
    canvas.style.height = `${height / ratio}px`;

    context.lineWidth = 1;
    context.lineCap = "square";
    context.fillStyle = "rgba(255,255,255,0.01)";
    context.strokeStyle = "#333";

    let range = _.chain(n)
      .range()
      .map(n => n + 1)
      .value();

    let coords = _.product(range, range);

    let lissajous = _.chain(coords)
      .reduce((lissajous, [a, b]) => {
        let w = width / n;
        let h = height / n;
        let d = Math.PI / 2;
        let t = 0;
        let dt = 0.01;
        let scaleA = (w / a) * 0.25;
        let scaleB = (w / b) * 0.25;

        let cx = (a - 1) * w + w / 2;
        let cy = (b - 1) * h + h / 2;

        let x = cx + a * Math.sin(d) * scaleA;
        let y = cy + b * Math.sin(0) * scaleB;

        lissajous[[a, b]] = {
          d,
          t,
          dt,
          scaleA,
          scaleB,
          cx,
          cy,
          x,
          y
        };
        return lissajous;
      }, {})
      .value();

    let requestId;
    const render = () => {
      context.fillRect(0, 0, width, height);
      context.beginPath();

      _.chain(coords)
        .map(([a, b]) => {
          let l = lissajous[[a, b]];
          context.moveTo(l.x, l.y);
          l.x = l.cx + a * Math.sin(a * l.t + l.d) * l.scaleA;
          l.y = l.cy + b * Math.sin(b * l.t) * l.scaleB;
          context.lineTo(l.x, l.y);
          context.stroke();

          l.t += l.dt;
        })
        .value();

      requestId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(requestId);
  });

  return <Canvas ref={ref}></Canvas>;
};

export default Lissajous;
