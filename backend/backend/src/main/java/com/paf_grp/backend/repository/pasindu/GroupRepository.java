package com.paf_grp.backend.repository.pasindu;

import com.paf_grp.backend.model.pasindu.user_group.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GroupRepository extends MongoRepository<Group, String> {
}
