import {
  Box,
  Stack,
  Typography,
  IconButton,
  Link,
  Button,
} from "@mui/material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faComment,
  faGlobe,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useFetchLarps } from "../../hooks/useFetchLarps";
import { LarpQuery } from "../../types";
import { base64Encode } from "../../util/utilities";
import "./Carousel.scss";
import { Link as RouterLink } from "react-router-dom";
import DurationDisplay from "../Events/DurationDisplay";

type CarouselProps = {
  filterSet: LarpQuery;
};

const BREAKPOINTS = {
  sm: 600,
  md: 900,
};

const MAX_WIDTH = 1280;

function EventCarousel({ filterSet }: CarouselProps) {
  const query = base64Encode(JSON.stringify(filterSet));
  const { larps } = useFetchLarps(query);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [itemSizes, setItemSizes] = useState({
    itemWidth: 0,
    featuredWidth: 0,
    marginWidth: 0,
  });

  function showNext() {
    setDisplayIdx((displayed) => (larps.length + displayed + 1) % larps.length);
  }
  function showPrev() {
    setDisplayIdx((displayed) => (larps.length + displayed - 1) % larps.length);
  }

  //handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(() => window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //recalculate layout based on breakpoints
  useLayoutEffect(() => {
    if (windowSize <= BREAKPOINTS.sm) {
      setItemSizes(() => ({
        itemWidth: 50,
        featuredWidth: 300,
        marginWidth: 16,
      }));
    } else if (windowSize > BREAKPOINTS.sm && windowSize <= BREAKPOINTS.md) {
      setItemSizes(() => ({
        itemWidth: 100,
        featuredWidth: 500,
        marginWidth: 16,
      }));
    } else {
      setItemSizes(() => ({
        itemWidth: 150,
        featuredWidth: 700,
        marginWidth: 16,
      }));
    }
  }, [windowSize]);

  //Handle User Inputs
  function handleNextClick(e: React.MouseEvent) {
    e.preventDefault();
    showNext();
  }
  function handlePrevClick(e: React.MouseEvent) {
    e.preventDefault();
    showPrev();
  }

  function handleWheelInput(e: React.WheelEvent) {
    //Inputs for "Next"
    if (e.deltaX && e.deltaX > 0) {
      showNext();
    }
    if (e.deltaX && e.deltaX < 0) {
      showPrev();
    }
  }

  // Calculate the offset for the carousel to clamp values within the window
  function getCarouselOffset() {
    const totalCarouselWidth =
      larps.length * itemSizes.marginWidth +
      (larps.length - 1) * itemSizes.itemWidth +
      itemSizes.featuredWidth;

    const containerSize = Math.min(windowSize, MAX_WIDTH);
    if (totalCarouselWidth < containerSize) return 0;

    const indexedOffset =
      displayIdx * (itemSizes.itemWidth + itemSizes.marginWidth);
    //adjust to show 'previous' item when index > 0
    const adjustment =
      displayIdx === 0 ? 0 : itemSizes.itemWidth + itemSizes.marginWidth;

    return Math.min(
      indexedOffset - adjustment - itemSizes.marginWidth,
      totalCarouselWidth - containerSize + itemSizes.marginWidth,
    );
  }

  return (
    <Box
      className="Carousel-container"
      component="section"
      onWheel={handleWheelInput}
      tabIndex={0}
    >
      {/* <Typography className="Carousel-title" variant='h2'>{title}</Typography> */}
      <Stack className="Carousel" justifyContent="start" direction="row">
        {larps.map((larp, idx) => (
          <Box
            key={larp.id}
            className={
              idx === displayIdx
                ? "Carousel-item Carousel-featured"
                : "Carousel-item"
            }
            sx={{
              backgroundImage: `url(${larp.imgUrl.md})`,
              flexBasis: () => {
                if (larps.length === 1) {
                  return "100%";
                } else {
                  return `${idx === displayIdx ? itemSizes.featuredWidth : itemSizes.itemWidth}px`;
                }
              },
              marginRight: `${itemSizes.marginWidth}px`,
              right: getCarouselOffset(),
            }}
            onClick={() => {
              setDisplayIdx(idx);
            }}
          >
            {idx === displayIdx && (
              <>
                <Box className="Carousel-featuredDuration">
                  <DurationDisplay start={larp.start} end={larp.end} />
                </Box>
                <Stack
                  className="Carousel-featuredContents"
                  direction="column"
                  spacing={1}
                >
                  <Stack direction="row" spacing={2} alignContent={"center"}>
                    <Link
                      component={RouterLink}
                      to={`/events/${larp.id}`}
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                        }}
                      >
                        {larp.title}
                      </Typography>
                    </Link>
                  </Stack>

                  <Stack
                    className="LarpCard-details"
                    direction="row"
                    spacing={3}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      className="icon-text"
                    >
                      <FontAwesomeIcon icon={faLocationDot} />
                      <Typography variant="details2">
                        {larp.city}, {larp.country}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      className="icon-text"
                    >
                      <FontAwesomeIcon icon={faComment} />
                      <Typography variant="details2">
                        {larp.language}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      className="icon-text"
                    >
                      <FontAwesomeIcon icon={faGlobe} />
                      <Typography variant="details2">
                        {larp.organization.orgName}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="body1"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: { xs: 6, md: 4 },
                      textOverflow: "ellipsis",
                    }}
                  >
                    {larp.description}
                  </Typography>

                  <Button
                    className="Carousel-featuredButton"
                    variant="contained"
                    component={RouterLink}
                    to={`/events/${larp.id}`}
                  >
                    More
                  </Button>
                </Stack>
              </>
            )}
          </Box>
        ))}
      </Stack>
      <Stack
        className="Carousel-navContainer"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          width: { xs: "100%", sm: "50%", md: "33%" },
        }}
      >
        <Box className="Carousel-navControl previousButton">
          <IconButton component="button" onClick={handlePrevClick}>
            <FontAwesomeIcon icon={faChevronLeft} color={"#070707"} />
          </IconButton>
        </Box>
        {larps.map((larp, idx) => (
          <Box
            className={
              idx === displayIdx
                ? "Carousel-navDot Carousel-navDot-selected"
                : "Carousel-navDot"
            }
            key={larp.id}
            onClick={() => {
              setDisplayIdx(idx);
            }}
          />
        ))}
        <Box className="Carousel-navControl nextButton">
          <IconButton component="button" onClick={handleNextClick}>
            <FontAwesomeIcon icon={faChevronRight} color={"#070707"} />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

export default EventCarousel;
