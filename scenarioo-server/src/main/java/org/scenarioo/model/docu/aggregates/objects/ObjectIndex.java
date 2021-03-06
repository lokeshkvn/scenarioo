/* scenarioo-server
 * Copyright (C) 2014, scenarioo.org Development Team
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.scenarioo.model.docu.aggregates.objects;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import org.scenarioo.model.docu.entities.generic.ObjectDescription;
import org.scenarioo.model.docu.entities.generic.ObjectReference;
import org.scenarioo.model.docu.entities.generic.ObjectTreeNode;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class ObjectIndex {

	private ObjectDescription object;

	private ObjectTreeNode<ObjectReference> referenceTree;

	public ObjectDescription getObject() {
		return object;
	}

	public void setObject(ObjectDescription object) {
		this.object = object;
	}

	public ObjectTreeNode<ObjectReference> getReferenceTree() {
		return referenceTree;
	}

	public void setReferenceTree(ObjectTreeNode<ObjectReference> referenceTree) {
		this.referenceTree = referenceTree;
	}

}
