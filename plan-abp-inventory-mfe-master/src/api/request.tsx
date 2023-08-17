/*
 * ===============================================================================================================
 *                                Copyright 2022, Blue Yonder Group, Inc.
 *                                           All Rights Reserved
 *
 *                               THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF
 *                                          BLUE YONDER GROUP, INC.
 *
 *
 *                         The copyright notice above does not evidence any actual
 *                                 or intended publication of such source code.
 *
 * ===============================================================================================================
 */

import axios from 'axios';

const api = axios.create({});

api.interceptors.request.use((config) => config);
api.interceptors.response.use((config) => config);

export { api };
