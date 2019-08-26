import React, { useEffect, useState } from 'react';
import { string, bool } from 'prop-types';
import styled from 'styled-components';

// images
import upIcon from '../../assets/img/up-button.png';
import downIcon from '../../assets/img/down-button.png';
import leftIcon from '../../assets/img/left-button.png';
import rightIcon from '../../assets/img/right-button.png';
import xIcon from '../../assets/img/x-button.png';
import oIcon from '../../assets/img/o-button.png';
import startIcon from '../../assets/img/start-button.png';

const ButtonLegend = ({
  autohide,
  arrows,
  up,
  down,
  left,
  right,
  start,
  x,
  o,
}) => {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (autohide) {
      setTimeout(() => {
        setHide(true);
      }, 7000);
    }
  }, []);
  return (
    <Container hide={hide}>
      {arrows ? (
        <ArrowsContainer>
          <Arrows>
            {up ? <Up src={upIcon} /> : null}
            {down ? <Down src={downIcon} /> : null}
            {left ? <Left src={leftIcon} /> : null}
            {right ? <Right src={rightIcon} /> : null}
          </Arrows>
          <p>{arrows}</p>
        </ArrowsContainer>
      ) : null}
      {start || x || o ? (
        <OtherButtons>
          {start ? (
            <ButtonContainer>
              <Button src={startIcon} />
              <p>{start}</p>
            </ButtonContainer>
          ) : null}
          {x ? (
            <ButtonContainer>
              <Button src={xIcon} />
              <p>{x}</p>
            </ButtonContainer>
          ) : null}
          {o ? (
            <ButtonContainer>
              <Button src={oIcon} />
              <p>{o}</p>
            </ButtonContainer>
          ) : null}
        </OtherButtons>
      ) : null}
    </Container>
  );
};

const ButtonContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-shrink: 0;
  margin-bottom: 0.5rem;
  align-items: center;

  & > img {
    width: 7.5rem;
    object-fit: contain;
    height: 3rem;
  }

  & > p {
    text-align: left;
    padding: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const OtherButtons = styled.div``;

const Container = styled.div`
  position: absolute;
  z-index: 999;
  right: 2rem;
  bottom: 2rem;
  max-width: 30rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 1);
  border-radius: 1rem;
  transition: opacity 0.5s ease;
  opacity: ${props => (props.hide ? 0 : 1)};
`;

const ArrowsContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-shrink: 0;
  align-items: center;

  & > p {
    text-align: left;
    padding: 1rem;
    font-weight: 700;
    font-size: 1.5rem;
  }
`;

const Arrows = styled.div`
  height: 7.5rem;
  width: 7.5rem;
  padding: 1rem;
  flex-shrink: 0;
  position: relative;

  & > img {
    height: 2.5rem;
    width: 2.5rem;
    object-fit: contain;
    position: absolute;
  }
`;

const Up = styled.img`
  top: 1rem;
  left: 2.56rem;
`;

const Down = styled.img`
  bottom: 1rem;
  left: 2.56rem;
`;

const Left = styled.img`
  left: 1rem;
  top: 2.5rem;
`;

const Right = styled.img`
  right: 1rem;
  top: 2.5rem;
`;

const Button = styled.img``;

ButtonLegend.defaultProps = {
  up: '',
  down: '',
  left: '',
  right: '',
  start: '',
  x: '',
  o: '',
  autohide: true,
};

ButtonLegend.propTypes = {
  up: bool,
  down: bool,
  left: bool,
  right: bool,
  start: string,
  autohide: bool,
  x: string,
  o: string,
  arrows: string,
};

export default ButtonLegend;
