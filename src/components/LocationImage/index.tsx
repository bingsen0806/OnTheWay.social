import { Location } from '../../api/types';

import utownSVG from '../../assets/location_images/utown.svg';
import lawSVG from '../../assets/location_images/law.svg';
import clbSVG from '../../assets/location_images/clb.svg';
import computingSVG from '../../assets/location_images/computing.svg';
import engineeringSVG from '../../assets/location_images/engineering.svg';
import fassSVG from '../../assets/location_images/fass.svg';
import scienceSVG from '../../assets/location_images/science.svg';
import bizSVG from '../../assets/location_images/biz.svg';
import sdeSVG from '../../assets/location_images/sde.svg';
import { IonImg } from '@ionic/react';
import styles from './styles.module.scss';

function getLocationIcon(location: Location) {
  switch (location) {
    case Location.UTOWN:
      return utownSVG;
    case Location.LAW:
      return lawSVG;
    case Location.CLB:
      return clbSVG;
    case Location.SOC:
      return computingSVG;
    case Location.SCIENCE:
      return scienceSVG;
    case Location.FASS:
      return fassSVG;
    case Location.ENGINEERING:
      return engineeringSVG;
    case Location.BIZ:
      return bizSVG;
    case Location.SDE:
      return sdeSVG;
  }
}

interface LocationImageProps {
  location: Location;
}

export default function LocationImage({ location }: LocationImageProps) {
  return (
    <IonImg
      src={getLocationIcon(location)}
      className={styles['image-container']}
    ></IonImg>
  );
}
