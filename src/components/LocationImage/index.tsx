import { Location } from '../../api/types';

import utown from '../../assets/location_images/utown.jpg';
import law from '../../assets/location_images/law.jpg';
import clb from '../../assets/location_images/clb.jpg';
import soc from '../../assets/location_images/soc.jpg';
import science from '../../assets/location_images/science.jpg';
import fass from '../../assets/location_images/fass.jpg';
import engineering from '../../assets/location_images/engineering.jpg';
import biz from '../../assets/location_images/biz.jpg';
import sde from '../../assets/location_images/sde.jpg';

import styles from './styles.module.scss';

function getLocationIcon(location: Location) {
  switch (location) {
    case Location.UTOWN:
      return utown;
    case Location.LAW:
      return law;
    case Location.CLB:
      return clb;
    case Location.SOC:
      return soc;
    case Location.SCIENCE:
      return science;
    case Location.FASS:
      return fass;
    case Location.ENGINEERING:
      return engineering;
    case Location.BIZ:
      return biz;
    case Location.SDE:
      return sde;
  }
}

interface LocationImageProps {
  location: Location;
}

export default function LocationImage({ location }: LocationImageProps) {
  return (
    <img
      src={getLocationIcon(location)}
      className={styles['image-container']}
    />
  );
}
