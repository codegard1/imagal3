import React, { useState, useCallback } from "react";
import Carousel, { Modal, ModalGateway } from "react-images";

import Layout from "../components/layout";
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import { FocusZone } from '@fluentui/react/lib/FocusZone';
import { List } from '@fluentui/react/lib/List';
import { getTheme, mergeStyleSets } from '@fluentui/style-utilities';
import { useConst } from '@fluentui/react-hooks';

const theme = getTheme();
const { palette, fonts } = theme;
const ROWS_PER_PAGE = 1;
const MAX_ROW_HEIGHT = 200;
const classNames = mergeStyleSets({
  listGrid: {
    overflow: 'hidden',
    fontSize: 0,
    position: 'relative',
  },
  listGridTile: {
    textAlign: 'center',
    outline: 'none',
    position: 'relative',
    float: 'left',
    background: palette.neutralLighter,
    selectors: {
      'focus:after': {
        content: '',
        position: 'absolute',
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
        boxSizing: 'border-box',
        border: `1px solid ${palette.white}`,
      },
    },
  },
  listGridSizer: {
    paddingBottom: '100%',
  },
  listGridPadder: {
    position: 'absolute',
    left: 5,
    top: 2,
    right: 5,
    bottom: 2,
  },
  listGridLabel: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#FFFFFF',
    position: 'absolute',
    padding: 10,
    bottom: 0,
    left: 0,
    width: '100%',
    fontSize: fonts.small.fontSize,
    boxSizing: 'border-box',
  },
  listGridImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
});


const GalleryPage = ({ data }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };



  const photos = data.allImageSharp.edges.map(edge => ({
    key: `photo-${edge.node.id}`,
    ...edge.node
  }));

  const columnCount = React.useRef(0);
  const rowHeight = React.useRef(0);

  const getItemCountForPage = React.useCallback((itemIndex, surfaceRect) => {
    if (itemIndex === 0) {
      columnCount.current = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      rowHeight.current = Math.floor(surfaceRect.width / columnCount.current);
    }
    return columnCount.current * ROWS_PER_PAGE;
  }, []);

  const onRenderCell = React.useCallback((item, index) => {
    return (
      <div
        className={classNames.listGridTile}
        data-is-focusable
        style={{
          width: 100 / columnCount.current + '%',
        }}
        onClick={(e) => { openLightbox(e, { item, index }) }}
      >
        <div className={classNames.listGridSizer}>
          <div className={classNames.listGridPadder}>
            {/* <Img fluid={item.fluid} /> */}
            <img src={item.fluid.src} className={classNames.listGridImage} />
            <span className={classNames.listGridLabel}>{item.title}</span>
          </div>
        </div>
      </div>
    );
  }, []);

  const getPageHeight = React.useCallback(() => {
    return rowHeight.current * ROWS_PER_PAGE;
  }, []);

  return (
    <Layout>
      <FocusZone>
        <List
          className={classNames.listGrid}
          items={photos}
          getItemCountForPage={getItemCountForPage}
          getPageHeight={getPageHeight}
          renderedWindowsAhead={1}
          onRenderCell={onRenderCell}
        />
      </FocusZone>
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x.original,
                srcSet: x.fluid.srcSet,
                caption: x.fluid.originalName
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </Layout>
  );
};

export const pageQuery = graphql`
query {
  allImageSharp(limit: 1000, skip: 0) {
    edges {
      node {
        id
        original {
          height
          width
          src
        }
        fluid(fit: COVER, cropFocus: CENTER, maxHeight: 100, maxWidth: 100, toFormat: PNG, pngCompressionSpeed: 8, pngQuality: 3) {
          srcSet
          originalImg
          originalName
          src
        }
      }
    }
  }
}
`;

export default GalleryPage;
