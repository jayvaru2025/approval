import express from 'express';
import { jwtStrategy } from '../../services/passport.service';
import { verifyTenantId } from '../../../utils/verifyTenantId';
import {
  addFavourite,
  addTechnician,
  deleteTechnician,
  getTechnicianLocation,
  getTechnicians,
  getTechnicianStatus,
  listTechnicianStatus,
  removeFavourite,
  updateTechnicianDetails,
  updateTechnicianLocation,
  updateTechnicianStatus,
  verifyTechnician,
} from '../controller/technician.controller';
import { verifyPermissions } from '../../../utils/verifyPermissions';
import { TEAM_MEMBER } from '../../role/type/permissions';

const router = express.Router();

router.post(
  '/',
  jwtStrategy().authenticate(),
  verifyTenantId,
  verifyPermissions([TEAM_MEMBER.ADD_TEAM_MEMBER]),
  addTechnician,
);

router.get(
  '/',
  jwtStrategy().authenticate(),
  verifyTenantId,
  verifyPermissions([TEAM_MEMBER.VIEW_TEAM_DIRECTORY]),
  getTechnicians,
);

router.get('/status', jwtStrategy().authenticate(), verifyTenantId, getTechnicianStatus);
router.put('/status', jwtStrategy().authenticate(), verifyTenantId, updateTechnicianStatus);
router.get('/list-status', jwtStrategy().authenticate(), verifyTenantId, listTechnicianStatus);

// No need of verification in verify endpoint
router.get('/verify', verifyTenantId, verifyTechnician);

router.put('/location', jwtStrategy().authenticate(), verifyTenantId, updateTechnicianLocation);
router.get('/location/:technicianId', jwtStrategy().authenticate(), verifyTenantId, getTechnicianLocation);

router.put(
  '/favourites/:id',
  jwtStrategy().authenticate(),
  verifyTenantId,
  verifyPermissions([TEAM_MEMBER.UPDATE_TEAM_MEMBER]),
  addFavourite,
);

router.delete(
  '/favourites/:id',
  jwtStrategy().authenticate(),
  verifyTenantId,
  verifyPermissions([TEAM_MEMBER.UPDATE_TEAM_MEMBER]),
  removeFavourite,
);

router.put(
  '/:id',
  jwtStrategy().authenticate(),
  verifyTenantId,
  verifyPermissions([TEAM_MEMBER.UPDATE_TEAM_MEMBER]),
  updateTechnicianDetails,
);

router.delete(
  '/:id',
  jwtStrategy().authenticate(),
  verifyTenantId,
  verifyPermissions([TEAM_MEMBER.DELETE_TEAM_MEMBER]),
  deleteTechnician,
);

export default router;
